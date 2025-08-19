// Data Storage
let schools = [
    {
        id: 1,
        name: 'Escola Municipal João de Barro',
        director: 'Maria Souza',
        students: 320,
        staff: 25,
        evasionRate: 3.2,
        status: 'Ativa',
        neighborhood: 'Itatira/Sede',
        address: 'Rua das Flores, 123 - Centro',
        level: 'Fundamental I',
        phone: '(11) 3456-7890',
        email: 'joao.barro@edu.sp.gov.br'
    },
    {
        id: 2,
        name: 'Escola Municipal Sol Nascente',
        director: 'Carlos Almeida',
        students: 210,
        staff: 18,
        evasionRate: 5.0,
        status: 'Ativa',
        neighborhood: 'Lagoa do Mato',
        address: 'Av. Principal, 456 - Jardim das Flores',
        level: 'Fundamental II',
        phone: '(11) 3456-7891',
        email: 'sol.nascente@edu.sp.gov.br'
    },
    {
        id: 3,
        name: 'Escola Municipal Ipê Amarelo',
        director: 'Fernanda Lima',
        students: 450,
        staff: 30,
        evasionRate: 2.5,
        status: 'Em reforma',
        neighborhood: 'Cachoeira',
        address: 'Rua do Ipê, 789 - Bela Vista',
        level: 'Ensino Médio',
        phone: '(11) 3456-7892',
        email: 'ipe.amarelo@edu.sp.gov.br'
    },
    {
        id: 4,
        name: 'Escola Municipal Esperança',
        director: 'João Silva',
        students: 280,
        staff: 22,
        evasionRate: 4.1,
        status: 'Ativa',
        neighborhood: 'Bandeira velho',
        address: 'Rua da Esperança, 321 - Vila Nova',
        level: 'EJA',
        phone: '(11) 3456-7893',
        email: 'esperanca@edu.sp.gov.br'
    },
    {
        id: 5,
        name: 'Escola Municipal Futuro Brilhante',
        director: 'Ana Costa',
        students: 380,
        staff: 28,
        evasionRate: 3.8,
        status: 'Ativa',
        neighborhood: 'Bandeira Novo',
        address: 'Av. do Futuro, 654 - Jardim Europa',
        level: 'Fundamental I',
        phone: '(11) 3456-7894',
        email: 'futuro.brilhante@edu.sp.gov.br'
    }
];

let currentUser = null;
let editingSchool = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

function initializeApp() {
    updateStats();
    populateFilters();
    renderSchools();
    showPage('home');
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            showPage(page);
            updateActiveNav(this);
        });
    });

    // Auth buttons
    document.getElementById('loginBtn').addEventListener('click', openLoginModal);
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('schoolForm').addEventListener('submit', handleSchoolSubmit);

    // Filters
    document.getElementById('neighborhoodFilter').addEventListener('change', applyFilters);
    document.getElementById('levelFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('evasionFilter').addEventListener('change', applyFilters);

    // Modal close events
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId + 'Page').classList.add('active');

    if (pageId === 'schools') {
        renderSchools();
    }
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateStats() {
    const totalSchools = schools.length;
    const totalStudents = schools.reduce((sum, school) => sum + school.students, 0);
    const totalStaff = schools.reduce((sum, school) => sum + school.staff, 0);
    const averageEvasion = totalStudents > 0 
        ? (schools.reduce((sum, school) => sum + (school.evasionRate * school.students), 0) / totalStudents)
        : 0;

    const activeSchools = schools.filter(s => s.status === 'Ativa').length;
    const repairSchools = schools.filter(s => s.status === 'Em reforma').length;
    const inactiveSchools = schools.filter(s => s.status === 'Desativada').length;

    document.getElementById('totalSchools').textContent = totalSchools;
    document.getElementById('totalStudents').textContent = totalStudents.toLocaleString();
    document.getElementById('totalStaff').textContent = totalStaff;
    document.getElementById('averageEvasion').textContent = averageEvasion.toFixed(1) + '%';
    document.getElementById('schoolsSubtitle').textContent = `${activeSchools} ativas • ${repairSchools} em reforma`;

    document.getElementById('activeCount').textContent = activeSchools;
    document.getElementById('repairCount').textContent = repairSchools;
    document.getElementById('inactiveCount').textContent = inactiveSchools;

    // Top performing schools
    const topSchools = schools
        .filter(s => s.status === 'Ativa')
        .sort((a, b) => a.evasionRate - b.evasionRate)
        .slice(0, 3);

    const topSchoolsHtml = topSchools.map(school => `
        <div class="top-school">
            <div class="school-info">
                <h4>${school.name}</h4>
                <p>${school.neighborhood}</p>
            </div>
            <span class="evasion-rate">${school.evasionRate}%</span>
        </div>
    `).join('');

    document.getElementById('topSchools').innerHTML = topSchoolsHtml;
}

function populateFilters() {
    const neighborhoods = [...new Set(schools.map(s => s.neighborhood))];
    const levels = [...new Set(schools.map(s => s.level))];
    const statuses = [...new Set(schools.map(s => s.status))];

    populateSelect('neighborhoodFilter', neighborhoods);
    populateSelect('levelFilter', levels);
    populateSelect('statusFilter', statuses);
}

function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    const currentValue = select.value;
    
    // Keep "Todos" option and add others
    const existingOptions = select.innerHTML;
    select.innerHTML = existingOptions.split('</option>')[0] + '</option>';
    
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
    
    select.value = currentValue;
}

function getFilteredSchools() {
    const neighborhoodFilter = document.getElementById('neighborhoodFilter').value;
    const levelFilter = document.getElementById('levelFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const evasionFilter = document.getElementById('evasionFilter').value;

    return schools.filter(school => {
        if (neighborhoodFilter && school.neighborhood !== neighborhoodFilter) return false;
        if (levelFilter && school.level !== levelFilter) return false;
        if (statusFilter && school.status !== statusFilter) return false;
        
        if (evasionFilter) {
            const rate = school.evasionRate;
            switch (evasionFilter) {
                case 'low':
                    if (rate > 3) return false;
                    break;
                case 'medium':
                    if (rate <= 3 || rate > 5) return false;
                    break;
                case 'high':
                    if (rate <= 5) return false;
                    break;
            }
        }
        
        return true;
    });
}

function renderSchools() {
    const filteredSchools = getFilteredSchools();
    const schoolsGrid = document.getElementById('schoolsGrid');
    const schoolCount = document.getElementById('schoolCount');

    schoolCount.textContent = `${filteredSchools.length} escola${filteredSchools.length !== 1 ? 's' : ''} encontrada${filteredSchools.length !== 1 ? 's' : ''}`;

    if (filteredSchools.length === 0) {
        schoolsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-school"></i>
                <h3>Nenhuma escola encontrada</h3>
                <p>Tente ajustar os filtros para encontrar o que você procura.</p>
            </div>
        `;
        return;
    }

    const schoolsHtml = filteredSchools.map(school => {
        const statusClass = school.status === 'Ativa' ? 'active' : 
                           school.status === 'Em reforma' ? 'repair' : 'inactive';
        
        const evasionClass = school.evasionRate <= 3 ? 'low' : 
                            school.evasionRate <= 5 ? 'medium' : 'high';

        return `
            <div class="school-card">
                <div class="school-header">
                    <div class="school-info">
                        <h3>${school.name}</h3>
                        <div class="school-detail">
                            <i class="fas fa-user-tie"></i>
                            <span>Dir.: ${school.director}</span>
                        </div>
                        <div class="school-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${school.neighborhood}</span>
                        </div>
                    </div>
                    <span class="status-badge ${statusClass}">${school.status}</span>
                </div>

                <div class="school-stats">
                    <div class="stat-item">
                        <i class="fas fa-users"></i>
                        <div>
                            <p>Alunos</p>
                            <p>${school.students}</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-user-check"></i>
                        <div>
                            <p>Funcionários</p>
                            <p>${school.staff}</p>
                        </div>
                    </div>
                </div>

                <div class="evasion-info">
                    <span>
                        <i class="fas fa-chart-line"></i>
                        Taxa de Evasão:
                    </span>
                    <span class="evasion-rate ${evasionClass}">${school.evasionRate}%</span>
                </div>

                <div class="school-actions">
                    <div class="contact-actions">
                        ${school.phone ? `<a href="tel:${school.phone}" title="Telefone"><i class="fas fa-phone"></i></a>` : ''}
                        ${school.email ? `<a href="mailto:${school.email}" title="E-mail"><i class="fas fa-envelope"></i></a>` : ''}
                    </div>
                    <div>
                        ${currentUser ? `<button class="btn-secondary" onclick="editSchool(${school.id})"><i class="fas fa-edit"></i> Editar</button>` : ''}
                        <button class="btn-outline" onclick="viewSchoolDetails(${school.id})">Ver Detalhes</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    schoolsGrid.innerHTML = schoolsHtml;
}

function applyFilters() {
    renderSchools();
}

// Authentication
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const adminActions = document.querySelectorAll('.admin-actions');

    if (currentUser) {
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userName.textContent = currentUser.name;
        adminActions.forEach(action => action.classList.remove('hidden'));
    } else {
        loginBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
        adminActions.forEach(action => action.classList.add('hidden'));
    }
}

function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('loginForm').reset();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Mock authentication
    if (email === 'admin@edu.sp.gov.br' && password === 'admin123') {
        currentUser = { id: 1, name: 'Administrador', email, role: 'admin' };
    } else if (email === 'editor@edu.sp.gov.br' && password === 'editor123') {
        currentUser = { id: 2, name: 'Editor', email, role: 'editor' };
    } else {
        alert('Email ou senha inválidos');
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeLoginModal();
    renderSchools(); // Re-render to show edit buttons
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    renderSchools(); // Re-render to hide edit buttons
}

// School Management
function openSchoolModal(school = null) {
    editingSchool = school;
    const modal = document.getElementById('schoolModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('schoolForm');

    title.textContent = school ? 'Editar Escola' : 'Nova Escola';
    
    if (school) {
        document.getElementById('schoolName').value = school.name;
        document.getElementById('schoolDirector').value = school.director;
        document.getElementById('schoolStudents').value = school.students;
        document.getElementById('schoolStaff').value = school.staff;
        document.getElementById('schoolEvasion').value = school.evasionRate;
        document.getElementById('schoolStatus').value = school.status;
        document.getElementById('schoolNeighborhood').value = school.neighborhood;
        document.getElementById('schoolLevel').value = school.level;
        document.getElementById('schoolAddress').value = school.address;
        document.getElementById('schoolPhone').value = school.phone || '';
        document.getElementById('schoolEmail').value = school.email || '';
    } else {
        form.reset();
    }

    modal.classList.add('active');
}

function closeSchoolModal() {
    document.getElementById('schoolModal').classList.remove('active');
    document.getElementById('schoolForm').reset();
    editingSchool = null;
}

function handleSchoolSubmit(e) {
    e.preventDefault();
    
    const schoolData = {
        name: document.getElementById('schoolName').value,
        director: document.getElementById('schoolDirector').value,
        students: parseInt(document.getElementById('schoolStudents').value),
        staff: parseInt(document.getElementById('schoolStaff').value),
        evasionRate: parseFloat(document.getElementById('schoolEvasion').value),
        status: document.getElementById('schoolStatus').value,
        neighborhood: document.getElementById('schoolNeighborhood').value,
        level: document.getElementById('schoolLevel').value,
        address: document.getElementById('schoolAddress').value,
        phone: document.getElementById('schoolPhone').value,
        email: document.getElementById('schoolEmail').value
    };

    if (editingSchool) {
        // Update existing school
        const index = schools.findIndex(s => s.id === editingSchool.id);
        schools[index] = { ...editingSchool, ...schoolData };
    } else {
        // Add new school
        const newSchool = {
            id: Date.now(),
            ...schoolData
        };
        schools.push(newSchool);
    }

    updateStats();
    populateFilters();
    renderSchools();
    closeSchoolModal();
}

function editSchool(id) {
    const school = schools.find(s => s.id === id);
    if (school) {
        openSchoolModal(school);
    }
}

function viewSchoolDetails(id) {
    const school = schools.find(s => s.id === id);
    if (school) {
        alert(`Detalhes da ${school.name}:\n\nDiretor: ${school.director}\nAlunos: ${school.students}\nFuncionários: ${school.staff}\nTaxa de Evasão: ${school.evasionRate}%\nStatus: ${school.status}\nEndereço: ${school.address}`);
    }
}

function exportData() {
    alert('Funcionalidade de exportação em desenvolvimento');
}

function closeModal(modal) {
    modal.classList.remove('active');
}
