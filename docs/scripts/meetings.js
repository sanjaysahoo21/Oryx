function generateTeamsLink(meetingData) {
    const subject = encodeURIComponent(meetingData.meetingTitle || 'Oryx Meeting');
    
    let teamsUrl = `https://teams.microsoft.com/l/meeting/new?subject=${subject}`;
    
    if (meetingData.meetingDate && meetingData.meetingTime) {
        const startDateTime = new Date(`${meetingData.meetingDate}T${meetingData.meetingTime}`);
        const startTime = startDateTime.toISOString().slice(0, 16);
        teamsUrl += `&startTime=${startTime}`;
    }
    
    if (meetingData.description) {
        const content = encodeURIComponent(
            `Subject: ${meetingData.subject || 'General'}\n` +
            `Level: ${meetingData.level || 'All levels'}\n` +
            `Mentor: ${meetingData.mentorName}\n` +
            `Duration: ${meetingData.duration} minutes\n\n` +
            `Description: ${meetingData.description}`
        );
        teamsUrl += `&content=${content}`;
    }
    
    return teamsUrl;
}

function isValidMeetingLink(url) {
    if (!url || typeof url !== 'string') return false;
    
    try {
        new URL(url);
        
        const validPlatforms = [
            'teams.microsoft.com',
            'zoom.us',
            'meet.google.com',
            'webex.com',
            'gotomeeting.com',
            'bluejeans.com',
            'skype.com',
            'discord.com',
            'whereby.com'
        ];
        
        return validPlatforms.some(platform => url.toLowerCase().includes(platform));
    } catch (error) {
        return false;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

function saveMeeting(meeting) {
    try {
        let meetings = JSON.parse(localStorage.getItem('oryx_meetings') || '[]');
        meetings.push(meeting);
        localStorage.setItem('oryx_meetings', JSON.stringify(meetings));
        return true;
    } catch (error) {
        return false;
    }
}

function clearAllMeetings() {
    localStorage.removeItem('oryx_meetings');
}

function refreshDemoData() {
    const demoData = createDemoData();
    localStorage.setItem('oryx_meetings', JSON.stringify(demoData));
    if (typeof displayMeetings === 'function') {
        displayMeetings();
    }
}

function debugLocalStorage() {
    const meetings = JSON.parse(localStorage.getItem('oryx_meetings') || '[]');
    return meetings;
}

function getMeetingById(id) {
    const meetings = loadMeetings();
    return meetings.find(meeting => meeting.id === id);
}

function createDemoData() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    function formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }
    
    return [
        {
            id: 'demo_001',
            meetingTitle: 'Introduction to JavaScript Programming',
            subject: 'Computer Science',
            level: 'Beginner',
            description: 'Learn the fundamentals of JavaScript programming including variables, functions, and basic DOM manipulation. Perfect for beginners who want to start their coding journey.',
            meetingDate: formatDateForInput(today),
            meetingTime: '14:00',
            duration: '90',
            mentorName: 'Dr. Sarah Johnson',
            privacy: 'public',
            meetingId: 'JS1-B2C-3D4',
            maxParticipants: '25',
            allowRecording: true,
            enableChat: true,
            meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_js_demo_001',
            createdAt: new Date().toISOString(),
            formattedDate: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            formattedTime: '2:00 PM'
        },
        {
            id: 'demo_002',
            meetingTitle: 'Advanced Mathematics: Calculus II',
            subject: 'Mathematics',
            level: 'Advanced',
            description: 'Deep dive into integration techniques, series, and differential equations. This session covers advanced calculus concepts with practical problem-solving.',
            meetingDate: formatDateForInput(tomorrow),
            meetingTime: '10:30',
            duration: '120',
            mentorName: 'Prof. Michael Chen',
            privacy: 'org',
            meetingId: 'MTH-A1B-2C3',
            maxParticipants: '15',
            allowRecording: false,
            enableChat: true,
            meetingLink: 'https://zoom.us/j/123456789?pwd=demo_math_meeting',
            createdAt: new Date().toISOString(),
            formattedDate: tomorrow.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            formattedTime: '10:30 AM'
        },
        {
            id: 'demo_003',
            meetingTitle: 'Data Science with Python',
            subject: 'Data Science',
            level: 'Intermediate',
            description: 'Explore data analysis, visualization, and machine learning basics using Python libraries like pandas, matplotlib, and scikit-learn.',
            meetingDate: formatDateForInput(nextWeek),
            meetingTime: '16:00',
            duration: '180',
            mentorName: 'Dr. Emily Rodriguez',
            privacy: 'public',
            meetingId: '123456789',
            maxParticipants: '30',
            allowRecording: true,
            enableChat: true,
            meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_example123%40thread.v2/0?context=%7b%22Tid%22%3a%22example-tenant-id%22%2c%22Oid%22%3a%22example-organizer-id%22%7d',
            createdAt: new Date().toISOString(),
            formattedDate: nextWeek.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            formattedTime: '4:00 PM'
        },
        {
            id: 'demo_004',
            meetingTitle: 'Web Development Fundamentals',
            subject: 'Web Development',
            level: 'Beginner',
            description: 'Introduction to HTML, CSS, and basic web development concepts. Perfect for those starting their web development journey.',
            meetingDate: formatDateForInput(yesterday),
            meetingTime: '15:00',
            duration: '120',
            mentorName: 'Mr. David Wilson',
            privacy: 'public',
            meetingId: 'WEB-F1R-2S3',
            maxParticipants: '20',
            allowRecording: true,
            enableChat: true,
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            createdAt: new Date().toISOString(),
            formattedDate: yesterday.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            formattedTime: '3:00 PM'
        },
        {
            id: 'demo_005',
            meetingTitle: 'Statistics and Probability',
            subject: 'Mathematics',
            level: 'Intermediate',
            description: 'Understanding statistical concepts, probability distributions, and hypothesis testing for data analysis.',
            meetingDate: formatDateForInput(lastWeek),
            meetingTime: '11:00',
            duration: '90',
            mentorName: 'Dr. Lisa Thompson',
            privacy: 'org',
            meetingId: 'STAT-P1B-2L3',
            maxParticipants: '18',
            allowRecording: false,
            enableChat: true,
            meetingLink: 'https://webex.com/meet/demo-stats-meeting',
            createdAt: new Date().toISOString(),
            formattedDate: lastWeek.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            formattedTime: '11:00 AM'
        }
    ];
}

function loadMeetings() {
    let meetings = JSON.parse(localStorage.getItem('oryx_meetings') || '[]');
    
    if (!meetings || meetings.length === 0) {
        const defaultMeetings = createDemoData();
        localStorage.setItem('oryx_meetings', JSON.stringify(defaultMeetings));
        meetings = defaultMeetings;
    }
    
    return meetings;
}

function createMeetingCard(meeting) {
    const now = new Date();
    const meetingDateTime = new Date(meeting.meetingDate + ' ' + meeting.meetingTime);
    const isUpcoming = meetingDateTime > now;
    const isPast = meetingDateTime < now;
    const isToday = meetingDateTime.toDateString() === now.toDateString();
    
    let statusClass = 'bg-success';
    let statusText = 'Upcoming';
    let joinButtonText = 'Join Meeting';
    let joinButtonClass = 'btn-primary';
    
    if (isPast) {
        statusClass = 'bg-secondary';
        statusText = 'Completed';
        joinButtonText = 'View Details';
        joinButtonClass = 'btn-outline-secondary';
    } else if (isToday) {
        statusClass = 'bg-warning';
        statusText = 'Today';
    }

    // Check if meeting has valid join link
    const hasValidLink = meeting.meetingLink && isValidMeetingLink(meeting.meetingLink);
    
    if (isUpcoming && !hasValidLink) {
        return '';
    }

    const durationText = meeting.duration >= 60 
        ? `${Math.floor(meeting.duration / 60)}h ${meeting.duration % 60 > 0 ? (meeting.duration % 60) + 'm' : ''}`.trim()
        : `${meeting.duration}m`;

    return `
        <div class="col-md-6 col-xl-4 mb-4">
            <div class="card h-100 meeting-card" data-meeting-id="${meeting.id}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="card-title text-primary mb-0 flex-grow-1" style="line-height: 1.3;">${meeting.meetingTitle}</h5>
                        <span class="badge ${statusClass} ms-2">${statusText}</span>
                    </div>
                    
                    <div class="mb-3">
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-user text-cyan me-2" style="width: 16px;"></i>
                            <span class="small text-light">${meeting.mentorName}</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-book text-cyan me-2" style="width: 16px;"></i>
                            <span class="small text-light">${meeting.subject || 'General'}</span>
                            ${meeting.level ? `<span class="badge bg-light text-muted ms-2 small">${meeting.level}</span>` : ''}
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-calendar text-cyan me-2" style="width: 16px;"></i>
                            <span class="small text-light">${meeting.formattedDate}</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-clock text-cyan me-2" style="width: 16px;"></i>
                            <span class="small text-light">${meeting.formattedTime} • ${durationText}</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-link text-cyan me-2" style="width: 16px;"></i>
                            <span class="small text-light">Online Meeting</span>
                        </div>
                    </div>

                    <div class="mb-3 flex-grow-1">
                        <p class="card-text small text-muted" style="line-height: 1.4;">
                            ${meeting.description ? 
                                (meeting.description.length > 100 ? 
                                    meeting.description.substring(0, 100) + '...' : 
                                    meeting.description) 
                                : 'No description provided.'}
                        </p>
                    </div>

                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-muted d-flex align-items-center">
                                <i class="fas fa-users me-1"></i>
                                Max: ${meeting.maxParticipants || 20}
                            </small>
                            <div class="d-flex gap-1">
                                ${meeting.allowRecording ? '<i class="fas fa-record-vinyl text-danger" title="Recording allowed"></i>' : ''}
                                ${meeting.enableChat ? '<i class="fas fa-comments text-primary" title="Chat enabled"></i>' : ''}
                                <i class="fas fa-${meeting.privacy === 'public' ? 'globe' : meeting.privacy === 'private' ? 'lock' : 'building'} text-muted" title="${meeting.privacy} meeting"></i>
                            </div>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button class="btn ${joinButtonClass} btn-sm flex-grow-1" onclick="joinMeeting('${meeting.id}')">
                                <i class="fas fa-video me-1"></i>${joinButtonText}
                            </button>
                            ${hasValidLink ? 
                                `<button class="btn btn-outline-primary btn-sm" onclick="copyMeetingLink('${meeting.id}')" title="Copy Meeting Link">
                                    <i class="fas fa-link"></i>
                                </button>` :
                                `<button class="btn btn-outline-secondary btn-sm" disabled title="No link available">
                                    <i class="fas fa-link-slash"></i>
                                </button>`
                            }
                            <button class="btn btn-outline-info btn-sm" onclick="viewMeetingDetails('${meeting.id}')" title="View Details">
                                <i class="fas fa-info"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function displayMeetings(meetings = null) {
    const upcomingContainer = document.getElementById('upcomingMeetingsContainer');
    const completedContainer = document.getElementById('completedMeetingsContainer');
    const emptyState = document.getElementById('emptyState');
    const noUpcomingMeetings = document.getElementById('noUpcomingMeetings');
    const noCompletedMeetings = document.getElementById('noCompletedMeetings');
    
    if (meetings === null) {
        meetings = loadMeetings();
    }

    if (meetings.length === 0) {
        if (upcomingContainer) upcomingContainer.innerHTML = '';
        if (completedContainer) completedContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (noUpcomingMeetings) noUpcomingMeetings.style.display = 'none';
        if (noCompletedMeetings) noCompletedMeetings.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    
    const now = new Date();
    const upcomingMeetings = [];
    const completedMeetings = [];
    
    meetings.forEach(meeting => {
        const meetingDateTime = new Date(meeting.meetingDate + ' ' + meeting.meetingTime);
        const hasValidLink = meeting.meetingLink && isValidMeetingLink(meeting.meetingLink);
        
        if (meetingDateTime > now) {
            if (hasValidLink) {
                upcomingMeetings.push(meeting);
            }
        } else {
            completedMeetings.push(meeting);
        }
    });
    
    upcomingMeetings.sort((a, b) => {
        const dateA = new Date(a.meetingDate + ' ' + a.meetingTime);
        const dateB = new Date(b.meetingDate + ' ' + b.meetingTime);
        return dateA - dateB;
    });
    
    completedMeetings.sort((a, b) => {
        const dateA = new Date(a.meetingDate + ' ' + a.meetingTime);
        const dateB = new Date(b.meetingDate + ' ' + b.meetingTime);
        return dateB - dateA;
    });

    // Display upcoming meetings
    if (upcomingContainer) {
        if (upcomingMeetings.length > 0) {
            upcomingContainer.innerHTML = upcomingMeetings.map(meeting => createMeetingCard(meeting)).join('');
            if (noUpcomingMeetings) noUpcomingMeetings.style.display = 'none';
        } else {
            upcomingContainer.innerHTML = '';
            if (noUpcomingMeetings) noUpcomingMeetings.style.display = 'block';
        }
    }
    
    // Display completed meetings
    if (completedContainer) {
        if (completedMeetings.length > 0) {
            completedContainer.innerHTML = completedMeetings.map(meeting => createMeetingCard(meeting)).join('');
            if (noCompletedMeetings) noCompletedMeetings.style.display = 'none';
        } else {
            completedContainer.innerHTML = '';
            if (noCompletedMeetings) noCompletedMeetings.style.display = 'block';
        }
    }
}

function completeMeetingCreation() {
    const meetingLink = document.getElementById('meetingLink').value.trim();
    
    if (!meetingLink) {
        alert('Please paste the meeting link to complete the setup.');
        document.getElementById('meetingLink').focus();
        return;
    }
    
    if (!isValidMeetingLink(meetingLink)) {
        alert('Please paste a valid meeting link (Teams, Zoom, Google Meet, etc.)');
        document.getElementById('meetingLink').focus();
        return;
    }
    
    const meetingData = window.tempMeetingData;
    if (!meetingData) {
        alert('Error: Meeting data not found. Please try again.');
        return;
    }
    
    meetingData.meetingLink = meetingLink;
    
    const saveSuccess = saveMeeting(meetingData);
    
    if (!saveSuccess) {
        alert('Error saving meeting. Please try again.');
        return;
    }
    
    document.getElementById('scheduleMeetingBtn').innerHTML = '<i class="fas fa-check me-2"></i>Meeting Scheduled!';
    document.getElementById('scheduleMeetingBtn').classList.remove('btn-success');
    document.getElementById('scheduleMeetingBtn').classList.add('btn-primary');
    document.getElementById('scheduleMeetingBtn').disabled = true;
    
    window.tempMeetingData = null;
    
    setTimeout(() => {
        window.location.href = 'join.html';
    }, 1500);
}

function joinMeeting(meetingId) {
    const meetings = loadMeetings();
    const meeting = meetings.find(m => m.id === meetingId);
    
    if (meeting) {
        if (meeting.meetingLink) {
            window.open(meeting.meetingLink, '_blank');
        } else {
            alert('Meeting link not available. Please contact the meeting organizer.');
        }
    } else {
        alert('Meeting not found. Please check the meeting ID.');
    }
}

function copyMeetingLink(meetingId) {
    const meetings = loadMeetings();
    const meeting = meetings.find(m => m.id === meetingId);
    
    if (meeting && meeting.meetingLink) {
        navigator.clipboard.writeText(meeting.meetingLink).then(() => {
            const originalText = event.target.innerHTML;
            event.target.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
            event.target.classList.remove('btn-outline-primary');
            event.target.classList.add('btn-success');
            
            setTimeout(() => {
                event.target.innerHTML = originalText;
                event.target.classList.remove('btn-success');
                event.target.classList.add('btn-outline-primary');
            }, 2000);
        });
    } else {
        alert('Meeting link not available yet.');
    }
}

function copyMeetingId(meetingId) {
    navigator.clipboard.writeText(meetingId).then(() => {
        const originalText = event.target.innerHTML;
        event.target.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
        event.target.classList.remove('btn-outline-primary');
        event.target.classList.add('btn-success');
        
        setTimeout(() => {
            event.target.innerHTML = originalText;
            event.target.classList.remove('btn-success');
            event.target.classList.add('btn-outline-primary');
        }, 2000);
    });
}

function viewMeetingDetails(meetingId) {
    const meetings = loadMeetings();
    const meeting = meetings.find(m => m.id === meetingId);
    
    if (meeting) {
        const durationText = meeting.duration >= 60 
            ? `${Math.floor(meeting.duration / 60)} hour${Math.floor(meeting.duration / 60) > 1 ? 's' : ''} ${meeting.duration % 60 > 0 ? `${meeting.duration % 60} minutes` : ''}`.trim()
            : `${meeting.duration} minutes`;

        const detailsHTML = `
            <div class="modal fade" id="meetingDetailsModal" tabindex="-1" aria-labelledby="meetingDetailsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content bg-dark">
                        <div class="modal-header border-secondary">
                            <h5 class="modal-title text-primary" id="meetingDetailsModalLabel">
                                <i class="fas fa-video me-2"></i>${meeting.meetingTitle}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="text-cyan mb-3">Meeting Information</h6>
                                    <p><strong class="text-light">Mentor:</strong> <span class="text-muted">${meeting.mentorName}</span></p>
                                    <p><strong class="text-light">Subject:</strong> <span class="text-muted">${meeting.subject || 'Not specified'}</span></p>
                                    <p><strong class="text-light">Level:</strong> <span class="text-muted">${meeting.level || 'All levels'}</span></p>
                                    <p><strong class="text-light">Meeting ID:</strong> <span class="text-cyan">${meeting.meetingId}</span></p>
                                    <p><strong class="text-light">Max Participants:</strong> <span class="text-muted">${meeting.maxParticipants || 20}</span></p>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="text-cyan mb-3">Schedule & Platform</h6>
                                    <p><strong class="text-light">Date:</strong> <span class="text-muted">${meeting.formattedDate}</span></p>
                                    <p><strong class="text-light">Time:</strong> <span class="text-muted">${meeting.formattedTime}</span></p>
                                    <p><strong class="text-light">Duration:</strong> <span class="text-muted">${durationText}</span></p>
                                    <p><strong class="text-light">Platform:</strong> <span class="text-muted">Microsoft Teams</span></p>
                                    <p><strong class="text-light">Privacy:</strong> <span class="text-muted text-capitalize">${meeting.privacy}</span></p>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-12">
                                    <h6 class="text-cyan mb-3">Description</h6>
                                    <p class="text-muted">${meeting.description || 'No description provided.'}</p>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-12">
                                    <h6 class="text-cyan mb-3">Meeting Features</h6>
                                    <div class="d-flex gap-3">
                                        <span class="badge ${meeting.allowRecording ? 'bg-success' : 'bg-secondary'}">
                                            <i class="fas fa-record-vinyl me-1"></i>
                                            Recording ${meeting.allowRecording ? 'Enabled' : 'Disabled'}
                                        </span>
                                        <span class="badge ${meeting.enableChat ? 'bg-primary' : 'bg-secondary'}">
                                            <i class="fas fa-comments me-1"></i>
                                            Chat ${meeting.enableChat ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer border-secondary">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-outline-primary" onclick="copyMeetingId('${meeting.meetingId}')">
                                <i class="fas fa-copy me-1"></i>Copy Meeting ID
                            </button>
                            <button type="button" class="btn btn-primary" onclick="joinMeeting('${meeting.id}')">
                                <i class="fas fa-video me-1"></i>Join Meeting
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('meetingDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', detailsHTML);

        const modal = new bootstrap.Modal(document.getElementById('meetingDetailsModal'));
        modal.show();

        document.getElementById('meetingDetailsModal').addEventListener('hidden.bs.modal', function () {
            this.remove();
        });
    }
}

function searchMeetings() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const allMeetings = loadMeetings();
    
    const filteredMeetings = allMeetings.filter(meeting => 
        meeting.meetingTitle.toLowerCase().includes(searchTerm) ||
        meeting.mentorName.toLowerCase().includes(searchTerm) ||
        (meeting.subject && meeting.subject.toLowerCase().includes(searchTerm)) ||
        (meeting.level && meeting.level.toLowerCase().includes(searchTerm)) ||
        (meeting.description && meeting.description.toLowerCase().includes(searchTerm))
    );
    
    displayMeetings(filteredMeetings);
}

function initializeMeetingsPage() {
    displayMeetings();
    
    if (document.getElementById('searchButton')) {
        document.getElementById('searchButton').addEventListener('click', searchMeetings);
    }
    
    if (document.getElementById('searchInput')) {
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchMeetings();
            }
        });
        
        document.getElementById('searchInput').addEventListener('input', function(e) {
            if (e.target.value === '') {
                displayMeetings();
            }
        });
    }
}

function initializeCreateFormPage() {
    console.log('Initializing create form page...');
    
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('meetingDate')) {
        document.getElementById('meetingDate').min = today;
    }
    
    const checkedPrivacy = document.querySelector('input[name="privacy"]:checked');
    if (checkedPrivacy) {
        const selectedCard = checkedPrivacy.closest('.card');
        selectedCard.style.borderColor = 'hsl(210, 95%, 70%)';
        selectedCard.style.boxShadow = '0 8px 20px hsl(210, 95%, 70%, 0.3)';
    }
    
    const form = document.getElementById('createClassForm');
    if (form) {
        console.log('Form found, adding event listener...');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submission triggered!');
            
            const meetingData = {
                id: Math.random().toString(36).substr(2, 9),
                meetingTitle: document.getElementById('meetingTitle')?.value?.trim() || '',
                subject: document.getElementById('subject')?.value?.trim() || '',
                level: document.getElementById('level')?.value?.trim() || '',
                description: document.getElementById('description')?.value?.trim() || '',
                meetingDate: document.getElementById('meetingDate')?.value || '',
                meetingTime: document.getElementById('meetingTime')?.value || '',
                duration: document.getElementById('duration')?.value || '60',
                mentorName: document.getElementById('mentorName')?.value?.trim() || '',
                meetingLink: null,
                privacy: 'public',
                meetingId: Math.random().toString(36).substr(2, 9).toUpperCase(),
                maxParticipants: document.getElementById('maxParticipants')?.value || '20',
                allowRecording: document.getElementById('allowRecording')?.checked || false,
                enableChat: document.getElementById('enableChat')?.checked || false,
                createdAt: new Date().toISOString()
            };
            
            meetingData.formattedDate = formatDate(meetingData.meetingDate);
            meetingData.formattedTime = formatTime(meetingData.meetingTime);
            
            const requiredFields = [
                { field: 'meetingTitle', name: 'Meeting Title', value: meetingData.meetingTitle },
                { field: 'meetingDate', name: 'Date', value: meetingData.meetingDate },
                { field: 'meetingTime', name: 'Time', value: meetingData.meetingTime },
                { field: 'mentorName', name: 'Mentor Name', value: meetingData.mentorName }
            ];
            
            const missingFields = requiredFields.filter(field => !field.value);
            
            if (missingFields.length > 0) {
                const missingFieldNames = missingFields.map(field => field.name).join(', ');
                alert(`Please fill in all required fields: ${missingFieldNames}`);
                return;
            }
            
            window.tempMeetingData = meetingData;
            
            const teamsUrl = generateTeamsLink(meetingData);
            window.open(teamsUrl, '_blank');
            
            document.getElementById('meetingLinkSection').style.display = 'block';
            
            document.getElementById('scheduleMeetingBtn').onclick = function() {
                completeMeetingCreation();
            };
            
            document.getElementById('meetingLinkSection').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        });
    } else {
        console.error('Form with ID createClassForm not found!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking for elements...');
    
    if (document.getElementById('upcomingMeetingsContainer') || document.getElementById('searchButton')) {
        console.log('Join page detected, initializing...');
        initializeMeetingsPage();
    }
    else if (document.getElementById('createClassForm')) {
        console.log('Create page detected, initializing...');
        initializeCreateFormPage();
    } else {
        console.log('No recognized page elements found');
    }
});
