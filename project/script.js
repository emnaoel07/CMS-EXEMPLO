// Data Storage
let schools = [
    {
        id: 1,
        name: 'EMEF Adelídia Magno de Oliveira',
        director: 'Raimundo Nonato Sales do Santos',
        students: 80,
        staff: 22,
        evasionRate: 3.2,
        status: 'Em reforma',
        neighborhood: 'Itatira/Sede',
        address: 'R. Padre José Laurindo - Centro, Itatira - CE',
        level: 'Fundamental I',
        phone: '(88) 98174-6260',
        email: 'adelidiamagno@yahoo.com.br',
        latitude: -4.529279120792821,    // EXEMPLO
        longitude: -39.62238382466763
    },
    {
        id: 2,
        name: 'EMEF José Paulo de Sousa - CERU',
        director: 'Maria Elizabete Ribeiro Pinho',
        students: 80,
        staff: 30,
        evasionRate: 4.0,
        status: 'Ativa',
        neighborhood: 'Lagoa do Mato',
        address: 'Av. Zezé Jucá, S/N, Lagoa do Mato, Itatira-CE',
        level: 'Fundamental II',
        phone: '(88) 3436-1067',
        email: 'N/T',
        latitude:   -4.638214052025138,     // EXEMPLO
        longitude: -39.673404818895165
    },
    {
        id: 3,
        name: 'EMEF José Pereira',
        director: 'Francisco Ericlaudio Costa Paula',
        students: 90,
        staff: 30,
        evasionRate: 2.5,
        status: 'Ativa',
        neighborhood: 'Bandeira',
        address: 'Bandeira Novo, EMEF José Pereira',
        level: 'Fundamental II',
        phone: '(11) 3456-7892',
        email: 'N/T'
    },
    {
        id: 4,
        name: 'CEI Maria de Fátima Félix',
        director: 'Maria Elizete Ribeiro Pinto Viana',
        students: 60,
        staff: 22,
        evasionRate: 2.1,
        status: 'Ativa',
        neighborhood: 'Morro branco',
        address: 'itatira ce, Morro Branco',
        level: 'infantil',
        phone: '(88) 3436-1067',
        email: 'N/T'
    },
    {
        id: 5,
        name: 'EMEIF Antônio Gomes de Sousa',
        director: 'Erandir Pereira',
        students: 80,
        staff: 28,
        evasionRate: 3.8,
        status: 'Ativa',
        neighborhood: 'cachoeira',
        address: 'itatira ce, cachoeira',
        level: 'Fundamental I',
        phone: '(88) 3436-1067',
        email: 'N/T'
        
    },
    {
        id: 6,
        name: 'EMEF Antônio Honorato',
        director: 'Antônia Amorim Batista',
        students: 80,
        staff: 28,
        evasionRate: 4.8,
        status: 'Desativada',
        neighborhood: 'Lagoa do Mato',
        address: 'Centro, S/N, Lagoa do Mato, Itatira-CE',
        level: 'Fundamental I',
        phone: '(88) 3436-1067',
        email: 'e.m.e.f.antoniohonorato@hotmail.com'
        
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
        document.querySelectorAll('.footer-section a[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            showPage(page);
            
            // Atualiza a navegação
            document.querySelectorAll('.nav-link').forEach(navLink => {
                if (navLink.dataset.page === page) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            });
            
            // Scroll para o topo
            window.scrollTo(0, 0);
        });
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
    if (pageId === 'transport') {
    initTransportPage();
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
    if (email === 'admin@educ.ce.gov.br' && password === 'admin123') {
        currentUser = { id: 1, name: 'Administrador', email, role: 'admin' };
    } else if (email === 'emanoel@educ.ce.gov.br' && password === 'editor123') {
        currentUser = { id: 2, name: 'Emanoel', email, role: 'Emanoel' };
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
        document.getElementById('schoolLatitude').value = school.latitude || '';
        document.getElementById('schoolLongitude').value = school.longitude || '';
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
        email: document.getElementById('schoolEmail').value,
        latitude: parseFloat(document.getElementById('schoolLatitude').value) || null,
        longitude: parseFloat(document.getElementById('schoolLongitude').value) || null
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
        let mapIframe = '';
        
        if (school.latitude && school.longitude) {
            mapIframe = `
                <iframe
                    width="100%"
                    height="300"
                    style="border:0; border-radius: 0.5rem; margin-bottom: 1rem;"
                    loading="lazy"
                    allowfullscreen
                    src="https://www.google.com/maps?q=${school.latitude},${school.longitude}&hl=pt&z=15&output=embed">
                </iframe>
            `;
        } else if (school.address) {
            mapIframe = `
                <iframe
                    width="100%"
                    height="300"
                    style="border:0; border-radius: 0.5rem; margin-bottom: 1rem;"
                    loading="lazy"
                    allowfullscreen
                    src="https://www.google.com/maps?q=${encodeURIComponent(school.address)}&hl=pt&z=15&output=embed">
                </iframe>
            `;
        }

        const detailsHtml = `
            ${mapIframe}
            <p><strong>Diretor:</strong> ${school.director}</p>
            <p><strong>Alunos:</strong> ${school.students}</p>
            <p><strong>Funcionários:</strong> ${school.staff}</p>
            <p><strong>Taxa de Evasão:</strong> ${school.evasionRate}%</p>
            <p><strong>Status:</strong> ${school.status}</p>
            <p><strong>localidade:</strong> ${school.neighborhood}</p>
            <p><strong>Nível:</strong> ${school.level}</p>
            <p><strong>Endereço:</strong> ${school.address}</p>
            <p><strong>Telefone:</strong> ${school.phone || '-'}</p>
            <p><strong>Email:</strong> ${school.email || '-'}</p>
        `;
        
        document.getElementById("schoolDetailsBody").innerHTML = detailsHtml;
        document.getElementById("detailsTitle").textContent = school.name;
        document.getElementById("schoolDetailsModal").classList.add("active");
    }
}



function closeSchoolDetails() {
    document.getElementById("schoolDetailsModal").classList.remove("active");
}


function exportData() {
    alert('Funcionalidade de exportação em desenvolvimento');
}

function closeModal(modal) {
    modal.classList.remove('active');
}
// Adicione isso na função setupEventListeners()
document.querySelectorAll('.footer-section a[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        showPage(page);
        
        // Atualiza a navegação
        document.querySelectorAll('.nav-link').forEach(navLink => {
            if (navLink.dataset.page === page) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
        
        // Scroll para o topo
        window.scrollTo(0, 0);
    });
});
let map = null;
let routeMarkers = [];
let routeLines = [];
function initTransportPage() {
    // Preencher filtros
    const schoolFilter = document.getElementById("schoolFilter");
    const neighborhoodFilter = document.getElementById("neighborhoodFilter");

    // Preenche opções únicas
    const schools = [...new Set(transportData.routes.map(r => r.schoolName))];
    const neighborhoods = [...new Set(transportData.routes.map(r => r.neighborhood))];

    schools.forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        schoolFilter.appendChild(opt);
    });

    neighborhoods.forEach(nb => {
        const opt = document.createElement("option");
        opt.value = nb;
        opt.textContent = nb;
        neighborhoodFilter.appendChild(opt);
    });

    // Renderiza todas as rotas inicialmente
    renderTransportRoutes(transportData.routes);

    // Listeners de filtros
    [schoolFilter, neighborhoodFilter, document.getElementById("shiftFilter")]
        .forEach(sel => sel.addEventListener("change", applyTransportFilters));
}
function applyTransportFilters() {
    const school = document.getElementById("schoolFilter").value;
    const neighborhood = document.getElementById("neighborhoodFilter").value;
    const shift = document.getElementById("shiftFilter").value;

    const filtered = transportData.routes.filter(r => {
        if (school && r.schoolName !== school) return false;
        if (neighborhood && r.neighborhood !== neighborhood) return false;
        if (shift && r.shift !== shift) return false;
        return true;
    });

    renderTransportRoutes(filtered);
}

// Dados de exemplo para transporte escolar
const transportData = {
    routes: [
        {
            id: 1,
            name: "Rota Centro/Zona Norte",
            schoolId: 1,
            schoolName: "EMEF Adelídia Magno de Oliveira",
            neighborhood: "Itatira/Sede",
            shift: "manha",
            schedule: [
                { time: "06:15", stop: "Praça da Matriz" },
                { time: "06:25", stop: "Rua Antonio alves guerra" },
                { time: "06:35", stop: "Av. Principal, 456" },
                { time: "06:45", stop: "EMEF Adelídia Magno de Oliveira" }
            ],
            coordinates: [
                [-4.5294322617043, -39.62256922681419], // Escola
                [-4.529897464073854, -39.62431055985069], // Ponto 1
                [-4.5316161258249075, -39.62504079623187], // Ponto 2
                [-4.531873453323848, -39.62504051331534]  // Ponto 3
            ],
            responsible: "Motorista: João Silva - (88) 99999-9999"
        },
        {
            id: 2,
            name: "Rota Lagoa do Mato",
            schoolId: 2,
            schoolName: "EMEF José Paulo de Sousa - CERU",
            neighborhood: "Lagoa do Mato",
            shift: "manha",
            schedule: [
                { time: "06:30", stop: "Entrada do Bairro" },
                { time: "06:40", stop: "Igreja São José" },
                { time: "06:50", stop: "Campo de Futebol" },
                { time: "07:00", stop: "EMEF José Paulo de Sousa - CERU" }
            ],
            coordinates: [
                [-4.651380221308887, -39.67057492076992], // Escola
                [-4.651273286277247, -39.676196830775346], // Ponto 1
                [-4.648606299100915, -39.67647206958548]  // Ponto 2
            ],
            responsible: "Motorista: Maria Santos - (88) 98888-8888"
        },
        {
            id: 3,
            name: "Rota Bandeira - Manhã",
            schoolId: 3,
            schoolName: "EMEF José Pereira",
            neighborhood: "Bandeira",
            shift: "manha",
            schedule: [
                { time: "06:20", stop: "Centro do Bairro" },
                { time: "06:35", stop: "Escola Municipal" },
                { time: "06:50", stop: "EMEF José Pereira" }
            ],
            coordinates: [
                [-4.600000, -39.650000], // Escola (aproximado)
                [-4.601000, -39.651000], // Ponto 1
                [-4.602000, -39.652000]  // Ponto 2
            ],
            responsible: "Motorista: Francisco Silva - (88) 97777-7777"
        },
        {
            id: 4,
            name: "Rota Bandeira - Tarde",
            schoolId: 3,
            schoolName: "EMEF José Pereira",
            neighborhood: "Bandeira",
            shift: "tarde",
            schedule: [
                { time: "12:30", stop: "Centro do Bairro" },
                { time: "12:45", stop: "Escola Municipal" },
                { time: "13:00", stop: "EMEF José Pereira" }
            ],
            coordinates: [
                [-4.600000, -39.650000], // Escola (aproximado)
                [-4.601000, -39.651000], // Ponto 1
                [-4.602000, -39.652000]  // Ponto 2
            ],
            responsible: "Motorista: Francisco Silva - (88) 97777-7777"
        },
        {
            id: 5,
            name: "Rota Itatira/Lagoa do Mato - Todos os Turnos",
            schoolId: 3,
            schoolName: "EMEF José Pereira9",
            neighborhood: "Itatira",
            shift: "Todos os Turnos",
            schedule: [
                { time: "12:30", stop: "Centro do Bairro" },
                { time: "12:45", stop: "Escola Municipal" },
                { time: "13:00", stop: "EMEF José Pereira" }
            ],
            coordinates: [
                [-4.638313882473267, -39.67349074129679], // Escola (aproximado)
                [-4.590622071844314, -39.649131563514736],
                [-4.586728475424856, -39.64509149814919],
                [-4.580646842090787, -39.6428878261268], // Ponto 1
                [-4.530706018965982, -39.62496105574707],  // Ponto 2
                [-4.5296420846496686, -39.623029602006014]
                
            ],
            responsible: "Motorista: Francisco Silva - (88) 97777-7777"
        }
    ]
};

// Renderiza a lista de rotas
function renderTransportRoutes(routes) {
    const routesList = document.getElementById("routesList");
    const routesCount = document.getElementById("routesCount");

    routesCount.textContent = `${routes.length} rota${routes.length !== 1 ? 's' : ''}`;

    if (!routes.length) {
        routesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-route"></i>
                <p>Nenhuma rota encontrada</p>
            </div>
        `;
        return;
    }

    routesList.innerHTML = routes.map(route => `
        <div class="route-item" onclick="showRouteOnMap(${route.id})">
            <h4>${route.name}</h4>
            <p><strong>Escola:</strong> ${route.schoolName}</p>
            <p><strong>Turno:</strong> ${route.shift === 'manha' ? 'Manhã' : 
                                       route.shift === 'tarde' ? 'Tarde' : 
                                       route.shift === 'noite' ? 'Noite' : route.shift}</p>
            <p><strong>Localidade:</strong> ${route.neighborhood}</p>
        </div>
    `).join('');
}

// Mostra uma rota no mapa
function showRouteOnMap(routeId) {
    const route = transportData.routes.find(r => r.id === routeId);
    if (!route) return;

    // cria o mapa se ainda não existir
    if (!map) {
        map = L.map('transportMap').setView(route.coordinates[0], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }

    // limpa marcadores/linhas anteriores
    routeMarkers.forEach(m => map.removeLayer(m));
    routeLines.forEach(l => map.removeLayer(l));
    routeMarkers = [];
    routeLines = [];

    // adiciona marcadores
    route.coordinates.forEach((coord, idx) => {
        const marker = L.marker(coord).addTo(map)
            .bindPopup(idx === 0 ? "Escola" : `Ponto ${idx}`);
        routeMarkers.push(marker);
    });

    // desenha a linha
    const polyline = L.polyline(route.coordinates, { color: 'blue' }).addTo(map);
    routeLines.push(polyline);

    // centraliza o mapa na rota
    map.fitBounds(polyline.getBounds());

    // mostra detalhes da rota
    const details = document.getElementById("routeDetails");
    details.innerHTML = `
        <h3>${route.name}</h3>
        <p><strong>Motorista:</strong> ${route.responsible}</p>
        <ul>
            ${route.schedule.map(s => `<li>${s.time} - ${s.stop}</li>`).join('')}
        </ul>
    `;
}
function setHeaderOffsetVar(){
  const header = document.querySelector('.header');
  const h = header ? header.offsetHeight : 80;
  document.documentElement.style.setProperty('--header-h', h + 'px');
}

document.addEventListener('DOMContentLoaded', () => {
  setHeaderOffsetVar();
  window.addEventListener('resize', setHeaderOffsetVar);
});
