import React from 'react';

const ResumePreview = ({ data }) => {
    const { personalInfo, sections } = data;

    return (
        <div className="page" id="resume-preview">
            <header>
                <h1>{personalInfo.fullName}</h1>
                <div className="contact-info">
                    <span className="contact-item">
                        <i className="far fa-envelope"></i>
                        <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                    </span>
                    <span className="separator">|</span>
                    <span className="contact-item">
                        <i className="fas fa-phone"></i> {personalInfo.phone}
                    </span>
                    <span className="separator">|</span>
                    <span className="contact-item">
                        <i className="fas fa-map-marker-alt"></i> {personalInfo.location}
                    </span>
                    <span className="separator">|</span>
                    <span className="contact-item">
                        <i className="fab fa-linkedin"></i>
                        <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer">{personalInfo.linkedin}</a>
                    </span>
                    <span className="separator">|</span>
                    <span className="contact-item">
                        <i className="fab fa-github"></i>
                        <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer">{personalInfo.github}</a>
                    </span>
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
                            {entry.description && (
                                <ul>
                                    {entry.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}

                    {section.type === 'skills' && section.list.map((skill, index) => (
                        <div key={index} className="skill-item">
                            <span className="skill-label">{skill.label}:</span> {skill.value}
                        </div>
                    ))}

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
