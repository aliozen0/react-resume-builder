import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical,
    Trash2,
    Plus,
    ChevronDown,
    ChevronUp,
    FileText,
    List,
    Briefcase,
    Award
} from 'lucide-react';

// --- Sortable Item Component ---
function SortableSectionItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '10px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    };

    return (
        <div ref={setNodeRef} style={style}>
            {/* Header Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid #f0f0f0',
                background: '#fafafa'
            }}>
                {/* Drag Handle */}
                <div {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: '10px', color: '#999' }}>
                    <GripVertical size={20} />
                </div>

                {/* Title Display/Edit */}
                <div style={{ flexGrow: 1, fontWeight: 600, fontSize: '14px', color: '#333' }}>
                    {props.title}
                </div>

                {/* Actions */}
                <button
                    onClick={props.onDelete}
                    className="btn-icon-danger"
                    title="Delete Section"
                >
                    <Trash2 size={16} />
                </button>
                <button
                    onClick={props.onToggle}
                    className="btn-icon"
                    title={props.isOpen ? "Collapse" : "Expand"}
                >
                    {props.isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {/* Expandable Content */}
            {props.isOpen && (
                <div style={{ padding: '15px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label className="field-label">Section Title</label>
                        <input
                            className="modern-input"
                            value={props.section.title}
                            onChange={(e) => props.onUpdate(props.section.id, { ...props.section, title: e.target.value })}
                        />
                    </div>
                    {props.children}
                </div>
            )}
        </div>
    );
}

// --- Main Editor Component ---
const EditorPanel = ({ data, setData }) => {
    const [activeId, setActiveId] = useState(null);
    const [openSections, setOpenSections] = useState({}); // Track expanded state

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const toggleSection = (id) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setData((prev) => {
                const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
                const newIndex = prev.sections.findIndex((s) => s.id === over.id);
                return {
                    ...prev,
                    sections: arrayMove(prev.sections, oldIndex, newIndex),
                };
            });
        }
        setActiveId(null);
    };

    // --- Update Helpers ---
    const updatePersonalInfo = (field, value) => {
        setData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const updateSection = (id, newSectionData) => {
        setData(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === id ? newSectionData : s)
        }));
    };

    const deleteSection = (id) => {
        if (window.confirm("Are you sure you want to delete this section?")) {
            setData(prev => ({
                ...prev,
                sections: prev.sections.filter(s => s.id !== id)
            }));
        }
    };

    const addSection = (type) => {
        const newId = \`section-\${Date.now()}\`;
      let newSection = {
          id: newId,
          title: "New Section",
          type: type,
      };

      if (type === 'text') newSection.content = "New text content...";
      if (type === 'list') newSection.items = ["New item"];
      if (type === 'entries') newSection.entries = [];
      if (type === 'skills') newSection.list = [{ label: "Skill", value: "Details" }];

      setData(prev => ({
          ...prev,
          sections: [...prev.sections, newSection]
      }));
      setOpenSections(prev => ({ ...prev, [newId]: true }));
  };

  // --- Content Renderers ---
  const renderSectionContent = (section) => {
      if(section.type === 'text') {
          return (
              <textarea 
                  className="modern-textarea"
                  rows={4}
                  value={section.content}
                  onChange={(e) => updateSection(section.id, { ...section, content: e.target.value })}
              />
          );
      }
      if(section.type === 'entries') {
          return (
            <div>
                 {section.entries.map(entry => (
                    <div key={entry.id} className="entry-card">
                         <input 
                            className="modern-input bold" placeholder="Title"
                            value={entry.title}
                            onChange={(e) => {
                                const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, title: e.target.value } : en);
                                updateSection(section.id, { ...section, entries: newEntries });
                            }}
                         />
                         <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                             <input 
                                className="modern-input" placeholder="Subtitle"
                                value={entry.subtitle}
                                onChange={(e) => {
                                    const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, subtitle: e.target.value } : en);
                                    updateSection(section.id, { ...section, entries: newEntries });
                                }}
                             />
                             <input 
                                className="modern-input" placeholder="Date" style={{width: '120px'}}
                                value={entry.date}
                                onChange={(e) => {
                                    const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, date: e.target.value } : en);
                                    updateSection(section.id, { ...section, entries: newEntries });
                                }}
                             />
                         </div>
                         {/* Description Bullets */}
                         <div style={{marginTop: '10px'}}>
                             {entry.description?.map((desc, idx) => (
                                 <div key={idx} style={{display: 'flex', marginBottom: '5px', alignItems: 'center'}}>
                                     <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#333', marginRight: '8px'}}></div>
                                     <input 
                                        className="modern-input-subtle"
                                        value={desc}
                                        onChange={(e) => {
                                             const newDesc = [...entry.description];
                                             newDesc[idx] = e.target.value;
                                             const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, description: newDesc } : en);
                                             updateSection(section.id, { ...section, entries: newEntries });
                                        }}
                                     />
                                     <button 
                                        onClick={() => {
                                            const newDesc = entry.description.filter((_, i) => i !== idx);
                                            const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, description: newDesc } : en);
                                            updateSection(section.id, { ...section, entries: newEntries });
                                        }}
                                        className="btn-text-danger"
                                     >×</button>
                                 </div>
                             ))}
                             <button className="btn-small-add" onClick={() => {
                                 const newDesc = [...(entry.description || []), "New point"];
                                 const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, description: newDesc } : en);
                                 updateSection(section.id, { ...section, entries: newEntries });
                             }}>+ Add Point</button>
                         </div>
                         <button 
                            className="btn-danger-outline" 
                            style={{marginTop: '10px', width: '100%'}}
                            onClick={() => {
                                const newEntries = section.entries.filter(en => en.id !== entry.id);
                                updateSection(section.id, { ...section, entries: newEntries });
                            }}
                        >Remove Entry</button>
                    </div>
                 ))}
                 <button className="btn-primary-outline" onClick={() => {
                     const newEntry = { id: Date.now(), title: "New Entry", subtitle: "", date: "", description: [] };
                     updateSection(section.id, { ...section, entries: [...section.entries, newEntry] });
                 }}>+ Add Entry</button>
            </div>
          );
      }
      if(section.type === 'skills') {
          return (
              <div>
                  {section.list.map((skill, idx) => (
                      <div key={idx} style={{marginBottom: '10px', padding: '8px', background: '#f8f9fa', borderRadius: '4px'}}>
                          <label className="field-label-small">Category</label>
                          <input 
                              className="modern-input"
                              value={skill.label}
                              onChange={(e) => {
                                  const newList = [...section.list];
                                  newList[idx] = { ...newList[idx], label: e.target.value };
                                  updateSection(section.id, { ...section, list: newList });
                              }}
                          />
                          <label className="field-label-small" style={{marginTop: '5px'}}>Skills</label>
                          <textarea 
                              className="modern-textarea"
                              rows={2}
                              value={skill.value}
                              onChange={(e) => {
                                  const newList = [...section.list];
                                  newList[idx] = { ...newList[idx], value: e.target.value };
                                  updateSection(section.id, { ...section, list: newList });
                              }}
                          />
                          <button 
                            className="btn-text-danger" 
                            style={{marginTop: '5px', fontSize: '12px'}}
                            onClick={() => {
                                const newList = section.list.filter((_, i) => i !== idx);
                                updateSection(section.id, { ...section, list: newList });
                            }}
                          >Remove Category</button>
                      </div>
                  ))}
                  <button className="btn-small-add" onClick={() => {
                      updateSection(section.id, { ...section, list: [...section.list, { label: "New Category", value: "" }] });
                  }}>+ Add Skill Category</button>
              </div>
          );
      }
      if(section.type === 'list') {
           return (
              <div>
                  {section.items.map((item, idx) => (
                      <div key={idx} style={{display: 'flex', marginBottom: '8px'}}>
                           <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#333', marginTop: '10px', marginRight: '8px'}}></div>
                           <textarea 
                                className="modern-textarea"
                                rows={2}
                                value={item}
                                onChange={(e) => {
                                    const newItems = [...section.items];
                                    newItems[idx] = e.target.value;
                                    updateSection(section.id, { ...section, items: newItems });
                                }}
                           />
                           <button 
                                className="btn-icon-danger"
                                style={{marginLeft: '5px'}}
                                onClick={() => {
                                    const newItems = section.items.filter((_, i) => i !== idx);
                                    updateSection(section.id, { ...section, items: newItems });
                                }}
                            ><Trash2 size={16}/></button>
                      </div>
                  ))}
                   <button className="btn-small-add" onClick={() => {
                      updateSection(section.id, { ...section, items: [...section.items, "New item"] });
                  }}>+ Add Item</button>
              </div>
           );
      }
      return <div>Unknown Type</div>;
  };

  return (
    <div className="editor-panel">
      <h2 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: '#1a1a1a'}}>
        CV Builder
      </h2>
      
      {/* Personal Info Group */}
      <div className="group-container">
          <h3 className="group-title">Personal Info</h3>
          <div className="grid-2">
            <input className="modern-input" placeholder="Name" value={data.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} />
            <input className="modern-input" placeholder="Title/Role" value={data.personalInfo.title || ""} onChange={e => updatePersonalInfo('title', e.target.value)} />
          </div>
          <input className="modern-input" placeholder="Email" value={data.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} style={{marginTop: '8px'}} />
          <div className="grid-2" style={{marginTop: '8px'}}>
            <input className="modern-input" placeholder="Phone" value={data.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} />
            <input className="modern-input" placeholder="Location" value={data.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} />
          </div>
           <div style={{marginTop: '8px'}}>
             <input className="modern-input" placeholder="LinkedIn URL" value={data.personalInfo.linkedinUrl} onChange={e => updatePersonalInfo('linkedinUrl', e.target.value)} />
             <input className="modern-input" placeholder="GitHub URL" value={data.personalInfo.githubUrl} onChange={e => updatePersonalInfo('githubUrl', e.target.value)} style={{marginTop: '8px'}} />
           </div>
      </div>

      <div style={{ margin: '20px 0', borderBottom: '1px solid #ddd' }}></div>

      {/* Sections DnD List */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
            items={data.sections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {data.sections.map((section) => (
                    <SortableSectionItem 
                        key={section.id} 
                        id={section.id}
                        section={section}
                        title={section.title || section.id}
                        isOpen={openSections[section.id]}
                        onToggle={() => toggleSection(section.id)}
                        onUpdate={updateSection}
                        onDelete={() => deleteSection(section.id)}
                    >
                        {renderSectionContent(section)}
                    </SortableSectionItem>
                ))}
            </div>
        </SortableContext>
      </DndContext>
      
      {/* Add Section Controls */}
      <div className="add-section-container">
          <label style={{fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '8px', display: 'block'}}>ADD NEW SECTION</label>
          <div className="add-buttons-grid">
              <button className="btn-add-type" onClick={() => addSection('entries')}>
                  <Briefcase size={16} /> Experience
              </button>
              <button className="btn-add-type" onClick={() => addSection('entries')}>
                  <Award size={16} /> Education
              </button>
              <button className="btn-add-type" onClick={() => addSection('skills')}>
                  <List size={16} /> Skills
              </button>
              <button className="btn-add-type" onClick={() => addSection('text')}>
                  <FileText size={16} /> Text
              </button>
               <button className="btn-add-type" onClick={() => addSection('list')}>
                  <List size={16} /> List
              </button>
          </div>
      </div>

      <style>{`
            /* --- Modern CSS for Editor --- */
            .editor - panel {
            padding: 24px;
            background - color: #fcfcfc;
            height: 100vh;
            overflow - y: auto;
            border - right: 1px solid #e0e0e0;
            font - family: 'Inter', -apple - system, BlinkMacSystemFont, "Segoe UI", Roboto, sans - serif;
            color: #333;
        }

        .group - container {
    background: white;
    border: 1px solid #e8e8e8;
    border - radius: 8px;
    padding: 16px;
    box - shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

        .group - title {
    font - size: 13px;
    text - transform: uppercase;
    letter - spacing: 0.5px;
    color: #888;
    margin - bottom: 12px;
    font - weight: 600;
}

        .modern - input {
    width: 100 %;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border - radius: 6px;
    font - size: 14px;
    transition: all 0.2s;
    background: #fff;
}
        .modern - input:focus {
    border - color: #2563eb;
    box - shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    outline: none;
}
        .modern - input.bold {
    font - weight: 600;
}

        .modern - textarea {
    width: 100 %;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border - radius: 6px;
    font - size: 14px;
    font - family: inherit;
    resize: vertical;
}
        .modern - textarea:focus {
    border - color: #2563eb;
    outline: none;
}
        
        .modern - input - subtle {
    width: 100 %;
    padding: 6px;
    border: 1px solid transparent;
    border - radius: 4px;
    font - size: 14px;
    background: #f4f4f5;
}
        .modern - input - subtle:focus {
    background: white;
    border - color: #ddd;
    outline: none;
}

        .grid - 2 {
    display: grid;
    grid - template - columns: 1fr 1fr;
    gap: 8px;
}

        .field - label {
    display: block;
    font - size: 12px;
    font - weight: 500;
    color: #555;
    margin - bottom: 4px;
}
        .field - label - small {
    display: block;
    font - size: 11px;
    font - weight: 600;
    text - transform: uppercase;
    color: #999;
}

        .btn - icon {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #666;
    border - radius: 4px;
}
        .btn - icon:hover { background: #eee; color: #333; }

        .btn - icon - danger {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #ccc;
    border - radius: 4px;
}
        .btn - icon - danger:hover { background: #fee2e2; color: #ef4444; }

        .btn - text - danger {
    background: none;
    border: none;
    cursor: pointer;
    color: #ef4444;
    font - size: 12px;
    padding: 0 5px;
}
        .btn - text - danger:hover { text - decoration: underline; }

        .btn - small - add {
    background: none;
    border: 1px dashed #ccc;
    width: 100 %;
    padding: 6px;
    border - radius: 4px;
    color: #666;
    font - size: 12px;
    cursor: pointer;
    margin - top: 5px;
}
        .btn - small - add:hover { border - color: #999; color: #333; background: #fafafa; }

        .btn - primary - outline {
    width: 100 %;
    padding: 8px;
    border: 1px solid #2563eb;
    color: #2563eb;
    background: white;
    border - radius: 6px;
    font - weight: 500;
    cursor: pointer;
    margin - top: 10px;
}
        .btn - primary - outline:hover { background: #eff6ff; }

        .btn - danger - outline {
    width: 100 %;
    padding: 6px;
    border: 1px solid #fecaca;
    color: #ef4444;
    background: white;
    border - radius: 4px;
    font - size: 12px;
    cursor: pointer;
}
        .btn - danger - outline:hover { background: #fef2f2; }

        .entry - card {
    background: white;
    border: 1px solid #eee;
    border - radius: 6px;
    padding: 12px;
    margin - bottom: 12px;
    box - shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

        .add - section - container {
    margin - top: 30px;
    padding: 20px;
    background: #f0f4f8;
    border - radius: 8px;
    border: 1px dashed #cbd5e1;
}

        .add - buttons - grid {
    display: grid;
    grid - template - columns: 1fr 1fr;
    gap: 8px;
}

        .btn - add - type {
    display: flex;
    align - items: center;
    justify - content: center;
    gap: 8px;
    padding: 8px;
    background: white;
    border: 1px solid #e2e8f0;
    border - radius: 6px;
    color: #475569;
    font - size: 13px;
    cursor: pointer;
    font - weight: 500;
    transition: all 0.2s;
}
        .btn - add - type:hover {
    border - color: #94a3b8;
    transform: translateY(-1px);
    box - shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
`}</style>
    </div>
  );
};

export default EditorPanel;
