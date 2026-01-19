import React from 'react';

const ResumePreview = ({ data }) => {
    const { personalInfo, sections } = data;

    // Helper to build contact items array
    const contactItems = [
        {
            condition: personalInfo.email,
            icon: "far fa-envelope",
            content: <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
        },
        {
            condition: personalInfo.phone,
            icon: "fas fa-phone",
            content: personalInfo.phone
        },
        {
            condition: personalInfo.location,
            icon: "fas fa-map-marker-alt",
            content: personalInfo.location
        },
        {
            condition: personalInfo.linkedin,
            icon: "fab fa-linkedin",
            content: <a href={personalInfo.linkedinUrl || '#'} target="_blank" rel="noreferrer">{personalInfo.linkedin}</a>
        },
        {
            condition: personalInfo.github,
            icon: "fab fa-github",
            content: <a href={personalInfo.githubUrl || '#'} target="_blank" rel="noreferrer">{personalInfo.github}</a>
        }
    ].filter(item => item.condition); // Only keep items with data

    return (
        <div className="page" id="resume-preview">
            <header>
                <h1>{personalInfo.fullName}</h1>
                {personalInfo.title && <p className="job-title">{personalInfo.title}</p>}
                <div className="contact-info">
                    {contactItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <span className="contact-item">
                                <i className={item.icon}></i> {item.content}
                            </span>
                            {/* Add separator if it's not the last item */}
                            {index < contactItems.length - 1 && (
                                <span className="separator">|</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </header>

            {sections.map(section => (
                <div key={section.id} className="section">
                    <div className="section-header">
                        <div className="section-title">{section.title}</div>
                        <div className="line"></div>
                    </div>

                    {/* Render content based on section type */}
                    {section.type === 'text' && (
                        <div className="content">
                            {section.content}
                        </div>
                    )}

                    {section.type === 'entries' && section.entries.map(entry => (
                        <div key={entry.id} className="entry">
                            <div className="entry-header">
                                <div>
                                    <span className="entry-title">{entry.title}{entry.subtitle ? ',' : ''}</span>
                                    {entry.subtitle && <span className="entry-subtitle"> {entry.subtitle}</span>}
                                </div>
                                {entry.date && <div className="date">{entry.date}</div>}
                            </div>
                            {entry.description && entry.description.length > 0 && (
                                <ul>
                                    {entry.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}

                    {section.type === 'skills' && (
                        section.id === 'languages' ? (
                            <div className="languages-inline">
                                {section.list.map((skill, index) => (
                                    <span key={index} className="language-item">
                                        <span className="skill-label">{skill.label}</span>
                                        {skill.value && <span className="skill-value"> ({skill.value})</span>}
                                        {index < section.list.length - 1 && <span className="separator">, </span>}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            section.list.map((skill, index) => (
                                <div key={index} className="skill-item">
                                    <span className="skill-label">{skill.label}:</span> {skill.value}
                                </div>
                            ))
                        )
                    )}

                    {section.type === 'list' && (
                        <ul>
                            {section.items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}

                    {section.type === 'custom_html' && (
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ResumePreview;
