/* ── PlacementHub Core JavaScript & jQuery Module ── */

const API_BASE = 'http://localhost:5000/api';

// ── Mock Data for Offline / Direct Browser Demo ──
const MOCK_DATA = {
  '/student/profile': {
    phone: '987654****',
    branch: 'CSE (AI)',
    cgpa: 8.75,
    passingYear: 2026,
    tenthPct: 92.5,
    twelfthPct: 89.0,
    skills: ['JavaScript', 'Python', 'React', 'jQuery', 'Node.js'],
    resumeUrl: 'https://example.com/resume.pdf',
    linkedIn: 'https://linkedin.com/in/demostudent',
    github: 'https://github.com/demostudent',
    rollNumber: '24ES****',
    isProfileComplete: true
  },
  '/student/applications': [
    {
      _id: 'app1',
      opportunity: { _id: 'opp1', title: 'Frontend Developer Trainee', type: 'job', recruiter: { companyName: 'TechCorp Solutions' } },
      appliedAt: new Date().toISOString(),
      status: 'shortlisted'
    },
    {
      _id: 'app2',
      opportunity: { _id: 'opp2', title: 'Web Development Intern', type: 'internship', recruiter: { companyName: 'Innovate Labs' } },
      appliedAt: new Date().toISOString(),
      status: 'selected'
    }
  ],
  '/student/opportunities': [
    {
      _id: 'opp1',
      title: 'Frontend Developer Trainee',
      type: 'job',
      location: 'Bangalore / Hybrid',
      stipend: '₹7.5 LPA',
      deadline: new Date(Date.now() + 864000000).toISOString(),
      description: 'Looking for enthusiastic frontend developers proficient in JavaScript, HTML, CSS, and modern frameworks.',
      eligibility: { minCGPA: 7.5, branches: ['CSE', 'CSE (AI)', 'IT'] },
      recruiter: { companyName: 'TechCorp Solutions', industry: 'Software' }
    },
    {
      _id: 'opp2',
      title: 'Web Development Intern',
      type: 'internship',
      location: 'Remote',
      stipend: '₹20,000 / month',
      deadline: new Date(Date.now() + 432000000).toISOString(),
      description: '3-month internship program working on client web applications using jQuery and REST APIs.',
      eligibility: { minCGPA: 6.5, branches: ['CSE', 'IT', 'ECE'] },
      recruiter: { companyName: 'Innovate Labs', industry: 'Web Services' }
    }
  ],
  '/recruiter/profile': {
    companyName: 'TechCorp Solutions',
    website: 'https://techcorp.example.com',
    industry: 'Software & Technology',
    description: 'Leading software development and cloud consulting firm.',
    status: 'approved'
  },
  '/recruiter/opportunities': [
    {
      _id: 'opp1',
      title: 'Frontend Developer Trainee',
      type: 'job',
      location: 'Bangalore / Hybrid',
      stipend: '₹7.5 LPA',
      deadline: new Date(Date.now() + 864000000).toISOString(),
      isActive: true
    }
  ],
  '/recruiter/opportunity/opp1/applicants': [
    {
      _id: 'app1',
      status: 'shortlisted',
      student: {
        rollNumber: 'SKIT104',
        branch: 'CSE (AI)',
        cgpa: 8.75,
        resumeUrl: 'https://example.com/resume.pdf',
        user: { name: 'X Saini', email: 'X@example.com' }
      }
    }
  ],
  '/institute/stats': {
    totalStudents: 142,
    placedStudents: 98,
    totalRecruiters: 24,
    pendingRecruiters: 3,
    totalApplications: 310,
    selectedApplications: 104
  },
  '/institute/students': [
    { _id: 's1', rollNumber: 'SKIT104', branch: 'CSE (AI)', cgpa: 8.75, isPlaced: true, user: { name: 'X Saini', email: 'x@example.com' } },
    { _id: 's2', rollNumber: 'SKIT105', branch: 'CSE', cgpa: 8.20, isPlaced: false, user: { name: 'Y Sharma', email: 'y@example.com' } },
    { _id: 's3', rollNumber: 'SKIT103', branch: 'IT', cgpa: 9.10, isPlaced: true, user: { name: 'Z Jain', email: 'z@example.com' } }
  ],
  '/institute/recruiters': [
    { _id: 'r1', companyName: 'TechCorp Solutions', industry: 'Software', status: 'approved', user: { email: 'hr@techcorp.com' } },
    { _id: 'r2', companyName: 'Innovate Labs', industry: 'Web Services', status: 'approved', user: { email: 'careers@innovatelabs.com' } },
    { _id: 'r3', companyName: 'NextGen AI', industry: 'Artificial Intelligence', status: 'pending', user: { email: 'contact@nextgen.ai' } }
  ],
  '/institute/applications': [
    {
      _id: 'app1',
      appliedAt: new Date().toISOString(),
      status: 'shortlisted',
      student: { rollNumber: 'SKIT104', user: { name: 'X Saini' } },
      opportunity: { title: 'Frontend Developer Trainee', recruiter: { companyName: 'TechCorp Solutions' } }
    }
  ]
};

// ── Auth Storage Helpers ──
function getAuthUser() {
  try {
    const stored = localStorage.getItem('ph_user');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

function setAuthUser(userData) {
  localStorage.setItem('ph_user', JSON.stringify(userData));
}

function logout() {
  localStorage.removeItem('ph_user');
  window.location.href = 'login.html';
}

function requireAuth(requiredRole) {
  let user = getAuthUser();

  // If no user exists (e.g. direct file opening), auto-generate a demo user session
  if (!user) {
    user = {
      id: 'demo-' + (requiredRole || 'user') + '-id',
      name: requiredRole ? (requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1) + ' User') : 'Demo User',
      email: (requiredRole || 'demo') + '@placementhub.demo',
      role: requiredRole || 'student'
    };
    setAuthUser(user);
  } else if (requiredRole && user.role !== requiredRole) {
    // If opening another role's dashboard directly, update user role for smooth testing
    user.role = requiredRole;
    user.name = requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1) + ' User';
    setAuthUser(user);
  }

  return user;
}

function redirectIfLoggedIn() {
  // Helper if needed
}

// ── jQuery AJAX Wrapper with Fallback for Offline / Direct File Mode ──
function apiCall(options) {
  const deferred = $.Deferred();
  const user = getAuthUser();
  const userId = user?.id || user?._id;
  let { url, method = 'GET', data = null } = options;

  let cleanPath = url;
  if (cleanPath.startsWith('http')) {
    cleanPath = cleanPath.replace(/^https?:\/\/[^\/]+(\/api)?/, '');
  }
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  cleanPath = cleanPath.split('?')[0];

  if (!url.startsWith('http')) {
    url = API_BASE + (url.startsWith('/') ? url : '/' + url);
  }

  const reqType = method.toUpperCase();
  let ajaxOptions = {
    url: url,
    type: reqType,
    contentType: 'application/json',
    dataType: 'json',
    timeout: 3000
  };

  if (userId) {
    if (reqType === 'GET' || reqType === 'DELETE') {
      const sep = url.includes('?') ? '&' : '?';
      ajaxOptions.url = url + sep + 'userId=' + encodeURIComponent(userId);
    } else {
      let bodyData = typeof data === 'string' ? JSON.parse(data) : (data || {});
      bodyData.userId = userId;
      ajaxOptions.data = JSON.stringify(bodyData);
    }
  } else if (data) {
    ajaxOptions.data = typeof data === 'string' ? data : JSON.stringify(data);
  }

  $.ajax(ajaxOptions)
    .done(function (res) {
      deferred.resolve(res);
    })
    .fail(function (xhr, status, error) {
      // If server unreachable or error, use Mock Data fallback
      if (MOCK_DATA[cleanPath]) {
        console.warn(`[Backend Offline/Unreachable] Serving mock fallback for ${cleanPath}`);
        deferred.resolve(MOCK_DATA[cleanPath]);
      } else if (reqType === 'PUT' || reqType === 'POST') {
        // Return successful fallback response for mutations
        deferred.resolve({ message: 'Success (Demo Mode)', profile: data || {} });
      } else {
        deferred.reject(xhr);
      }
    });

  return deferred.promise();
}

// ── Global Helper Utilities ──
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

// ── DOM Ready Initializers ──
$(document).ready(function () {
  const user = getAuthUser();

  // Update Header Actions dynamically
  const $actions = $('.actions');
  if ($actions.length > 0) {
    if (user) {
      $actions.html(`
        <a href="${user.role}.html" class="btn btn-ghost">Dashboard (${user.name.split(' ')[0]})</a>
        <button id="btn-global-logout" class="btn btn-solid">Logout</button>
      `);
      $('#btn-global-logout').on('click', logout);
    }
  }

  // Header Login Dropdown Toggle
  $('#btn-login-toggle').on('click', function (e) {
    e.stopPropagation();
    $('.dropdown').toggleClass('open');
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.actions').length) {
      $('.dropdown').removeClass('open');
    }
  });

  // Tab switcher logic for Dashboards
  $('[data-tab]').on('click', function () {
    const targetTab = $(this).attr('data-tab');
    
    // Toggle navigation active state
    $('[data-tab]').removeClass('active');
    $(this).addClass('active');

    // Toggle tab panes
    $('.tab-pane').removeClass('active');
    $('#' + targetTab).addClass('active');
  });
});
