import React, { useState, useRef, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
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
    ChevronDown,
    ChevronUp,
    FileText,
    List,
    Briefcase,
    Award,
    Calendar
} from 'lucide-react';

// --- Reusable Auto-Expanding Textarea ---
const AutoTextArea = ({ className, value, onChange, placeholder, rows = 1, style }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            className={className}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{ ...style, overflow: 'hidden', resize: 'none' }}
        />
    );
};

// --- Date Helper ---
const formatDate = (isoMonth) => {
    if (!isoMonth) return "";
    const [year, month] = isoMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

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
    };

    return (
        <div ref={setNodeRef} style={style} className={`sortable-section ${isDragging ? 'dragging' : ''}`}>
            {/* Header Bar */}
            <div
                className={`section-header ${props.isOpen ? 'open' : ''}`}
                onClick={(e) => {
                    // Prevent toggling when clicking buttons or inputs
                    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.no-drag')) return;
                    props.onToggle();
                }}
            >
                {/* Drag Handle */}
                <div {...attributes} {...listeners} className="drag-handle">
                    <GripVertical size={18} />
                </div>

                {/* Title Display */}
                <div className="section-title-text">
                    {props.title}
                </div>

                {/* Actions */}
                <div className="section-actions">
                    <button
                        onClick={(e) => { e.stopPropagation(); props.onDelete(); }}
                        className="btn-icon-danger"
                        title="Delete Section"
                    >
                        <Trash2 size={16} />
                    </button>
                    <div className="chevron-icon">
                        {props.isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </div>

            {/* Expandable Content */}
            {props.isOpen && (
                <div className="section-content">
                    <div className="mb-3">
                        <label className="field-label">Section Name (Visible on CV)</label>
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
    const [openSections, setOpenSections] = useState({});

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const toggleSection = (id) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setData((prev) => {
                const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
                const newIndex = prev.sections.findIndex((s) => s.id === over.id);
                return { ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) };
            });
        }
    };

    // --- Update Helpers ---
    const updatePersonalInfo = (field, value) => {
        setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
    };
    const updateSection = (id, newSectionData) => {
        setData(prev => ({ ...prev, sections: prev.sections.map(s => s.id === id ? newSectionData : s) }));
    };
    const deleteSection = (id) => {
        if (window.confirm("Delete this section?")) {
            setData(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
        }
    };
    const addSection = (type) => {
        const newId = `section-${Date.now()}`;
        let newSection = { id: newId, title: "New Section", type: type };
        if (type === 'text') newSection.content = "New text content...";
        if (type === 'list') newSection.items = ["New item"];
        if (type === 'entries') newSection.entries = [];
        if (type === 'skills') newSection.list = [{ label: "Category", value: "Skills..." }];

        setData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
        setOpenSections(prev => ({ ...prev, [newId]: true }));
    };

    // --- Content Renderers ---
    const renderSectionContent = (section) => {
        if (section.type === 'text') {
            return (
                <div>
                    <label className="field-label">Content</label>
                    <AutoTextArea
                        className="modern-textarea" rows={3} value={section.content}
                        onChange={(e) => updateSection(section.id, { ...section, content: e.target.value })}
                    />
                </div>
            );
        }
        if (section.type === 'entries') {
            return (
                <div className="flex flex-col gap-4">
                    {section.entries.map(entry => (
                        <div key={entry.id} className="entry-card">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-grow mr-2">
                                    <label className="field-label">Title / Degree</label>
                                    <input
                                        className="modern-input bold" placeholder="e.g. Software Engineer"
                                        value={entry.title}
                                        onChange={(e) => {
                                            const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, title: e.target.value } : en);
                                            updateSection(section.id, { ...section, entries: newEntries });
                                        }}
                                    />
                                </div>
                                <button className="btn-icon-danger mt-6" onClick={() => {
                                    const newEntries = section.entries.filter(en => en.id !== entry.id);
                                    updateSection(section.id, { ...section, entries: newEntries });
                                }}><Trash2 size={16} /></button>
                            </div>

                            <label className="field-label">Subtitle / Company</label>
                            <input
                                className="modern-input mb-3" placeholder="e.g. Google"
                                value={entry.subtitle}
                                onChange={(e) => {
                                    const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, subtitle: e.target.value } : en);
                                    updateSection(section.id, { ...section, entries: newEntries });
                                }}
                            />

                            {/* DUAL DATE PICKERS */}
                            <div className="date-grid mb-3">
                                <div>
                                    <label className="field-label-small">Start Date</label>
                                    <input
                                        type="month"
                                        className="modern-input no-drag"
                                        value={entry.startDate || ''}
                                        onChange={(e) => {
                                            const newStart = e.target.value;
                                            // Auto-format the display string: "Start - End"
                                            const startStr = formatDate(newStart);
                                            const endStr = entry.isCurrent ? "Present" : formatDate(entry.endDate);
                                            const combinedRange = startStr ? `${startStr} - ${endStr}` : entry.date; // fallback

                                            const newEntries = section.entries.map(en => en.id === entry.id ? {
                                                ...en,
                                                startDate: newStart,
                                                date: combinedRange
                                            } : en);
                                            updateSection(section.id, { ...section, entries: newEntries });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="field-label-small">End Date</label>
                                    <input
                                        type="month"
                                        className="modern-input no-drag"
                                        value={entry.endDate || ''}
                                        disabled={entry.isCurrent}
                                        style={{ opacity: entry.isCurrent ? 0.5 : 1 }}
                                        onChange={(e) => {
                                            const newEnd = e.target.value;
                                            const startStr = formatDate(entry.startDate);
                                            const endStr = formatDate(newEnd);
                                            const combinedRange = (startStr && endStr) ? `${startStr} - ${endStr}` : entry.date;

                                            const newEntries = section.entries.map(en => en.id === entry.id ? {
                                                ...en,
                                                endDate: newEnd,
                                                date: combinedRange
                                            } : en);
                                            updateSection(section.id, { ...section, entries: newEntries });
                                        }}
                                    />
                                </div>
                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        id={`curr_${entry.id}`}
                                        checked={entry.isCurrent || false}
                                        className="checkbox-custom"
                                        onChange={(e) => {
                                            const isCurr = e.target.checked;
                                            const startStr = formatDate(entry.startDate);
                                            const endStr = isCurr ? "Present" : formatDate(entry.endDate);
                                            const combinedRange = startStr ? `${startStr} - ${endStr}` : entry.date;

                                            const newEntries = section.entries.map(en => en.id === entry.id ? {
                                                ...en,
                                                isCurrent: isCurr,
                                                date: combinedRange
                                            } : en);
                                            updateSection(section.id, { ...section, entries: newEntries });
                                        }}
                                    />
                                    <label htmlFor={`curr_${entry.id}`} className="field-label ml-2 cursor-pointer no-drag">
                                        I currently work here (Present)
                                    </label>
                                </div>
                            </div>

                            {/* Fallback Manual Date Edit (Hidden unless needed or for advanced users) */}
                            {/* 
                         <input 
                            className="modern-input-subtle text-xs" 
                            value={entry.date} 
                            placeholder="Formatted Date String (Auto-generated)"
                            readOnly
                         /> 
                         */}


                            {/* Bullets */}
                            <label className="field-label-small">Key Achievements / Description</label>
                            <div className="flex flex-col gap-2 mt-1">
                                {entry.description?.map((desc, idx) => (
                                    <div key={idx} className="flex gap-2 items-start">
                                        <div className="bullet-dot"></div>
                                        <AutoTextArea
                                            className="modern-textarea-sm" rows={1} value={desc}
                                            onChange={(e) => {
                                                const newDesc = [...entry.description];
                                                newDesc[idx] = e.target.value;
                                                const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, description: newDesc } : en);
                                                updateSection(section.id, { ...section, entries: newEntries });
                                            }}
                                        />
                                        <button className="btn-text-danger" onClick={() => {
                                            const newDesc = entry.description.filter((_, i) => i !== idx);
                                            const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, description: newDesc } : en);
                                            updateSection(section.id, { ...section, entries: newEntries });
                                        }}>×</button>
                                    </div>
                                ))}
                                <button className="btn-small-add" onClick={() => {
                                    const newDesc = [...(entry.description || []), "New point"];
                                    const newEntries = section.entries.map(en => en.id === entry.id ? { ...en, description: newDesc } : en);
                                    updateSection(section.id, { ...section, entries: newEntries });
                                }}>+ Add Point</button>
                            </div>
                        </div>
                    ))}
                    <button className="btn-primary" onClick={() => {
                        const newEntry = { id: Date.now(), title: "New Position", subtitle: "", date: "", description: [] };
                        updateSection(section.id, { ...section, entries: [...section.entries, newEntry] });
                    }}>+ Add Entry</button>
                </div>
            );
        }
        if (section.type === 'skills') {
            return (
                <div>
                    {section.list.map((skill, idx) => (
                        <div key={idx} className="skill-row">
                            <label className="field-label">Category / Language</label>
                            <input
                                className="modern-input mb-1" placeholder="e.g. English" value={skill.label}
                                onChange={(e) => {
                                    const newList = [...section.list];
                                    newList[idx] = { ...newList[idx], label: e.target.value };
                                    updateSection(section.id, { ...section, list: newList });
                                }}
                            />
                            <label className="field-label">Details / Level</label>
                            <AutoTextArea
                                className="modern-textarea" placeholder="e.g. Native or C2" rows={1} value={skill.value}
                                onChange={(e) => {
                                    const newList = [...section.list];
                                    newList[idx] = { ...newList[idx], value: e.target.value };
                                    updateSection(section.id, { ...section, list: newList });
                                }}
                            />
                            <button className="btn-remove-sm" onClick={() => {
                                const newList = section.list.filter((_, i) => i !== idx);
                                updateSection(section.id, { ...section, list: newList });
                            }}>Remove Category</button>
                        </div>
                    ))}
                    <button className="btn-small-add mt-2" onClick={() => {
                        updateSection(section.id, { ...section, list: [...section.list, { label: "Category", value: "" }] });
                    }}>+ Add Skill Category</button>
                </div>
            );
        }
        if (section.type === 'list') {
            return (
                <div>
                    {section.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-start mb-2">
                            <div className="bullet-dot mt-3"></div>
                            <AutoTextArea
                                className="modern-textarea" rows={1} value={item}
                                onChange={(e) => {
                                    const newItems = [...section.items];
                                    newItems[idx] = e.target.value;
                                    updateSection(section.id, { ...section, items: newItems });
                                }}
                            />
                            <button className="btn-icon-danger mt-2" onClick={() => {
                                const newItems = section.items.filter((_, i) => i !== idx);
                                updateSection(section.id, { ...section, items: newItems });
                            }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                    <button className="btn-small-add" onClick={() => {
                        updateSection(section.id, { ...section, items: [...section.items, "New item"] });
                    }}>+ Add Item</button>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="editor-panel">
            <h2 className="editor-title">Resume Builder</h2>

            {/* Personal Info */}
            <div className="group-card">
                <h3 className="group-h3">Personal Info</h3>
                <div className="grid-2 mb-2">
                    <div>
                        <label className="field-label">Full Name</label>
                        <input className="modern-input" placeholder="Ali Özen" value={data.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Job Title / Role</label>
                        <input className="modern-input" placeholder="Software Engineer" value={data.personalInfo.title || ""} onChange={e => updatePersonalInfo('title', e.target.value)} />
                    </div>
                </div>
                <div className="mb-2">
                    <label className="field-label">Email Address</label>
                    <input className="modern-input" placeholder="example@gmail.com" value={data.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} />
                </div>
                <div className="grid-2 mb-2">
                    <div>
                        <label className="field-label">Phone Number</label>
                        <input className="modern-input" placeholder="+90 ..." value={data.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Location (e.g. City, Country)</label>
                        <input className="modern-input" placeholder="Ankara, Turkey" value={data.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        <label className="field-label">LinkedIn Text (Display)</label>
                        <input className="modern-input" placeholder="linkedin.com/in/user" value={data.personalInfo.linkedin} onChange={e => updatePersonalInfo('linkedin', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">LinkedIn URL (Link)</label>
                        <input className="modern-input" placeholder="https://..." value={data.personalInfo.linkedinUrl} onChange={e => updatePersonalInfo('linkedinUrl', e.target.value)} />
                    </div>
                    <div className="grid-2">
                        <div>
                            <label className="field-label">GitHub Text</label>
                            <input className="modern-input" placeholder="github.com/user" value={data.personalInfo.github} onChange={e => updatePersonalInfo('github', e.target.value)} />
                        </div>
                        <div>
                            <label className="field-label">GitHub URL</label>
                            <input className="modern-input" placeholder="https://..." value={data.personalInfo.githubUrl} onChange={e => updatePersonalInfo('githubUrl', e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-divider"></div>

            {/* Sections List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={data.sections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col">
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

            {/* Footer / Add Section */}
            <div className="add-section-dock">
                <label className="dock-label">Add to Resume</label>
                <div className="dock-grid">
                    <button className="dock-btn" onClick={() => addSection('entries')}><Briefcase size={18} /><span>Work</span></button>
                    <button className="dock-btn" onClick={() => addSection('entries')}><Award size={18} /><span>Education</span></button>
                    <button className="dock-btn" onClick={() => addSection('skills')}><List size={18} /><span>Skills</span></button>
                    <button className="dock-btn" onClick={() => addSection('text')}><FileText size={18} /><span>Text</span></button>
                </div>
            </div>

        </div>
    );
};

export default EditorPanel;
