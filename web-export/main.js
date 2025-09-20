// Simple React application for Arsenal Football School
(function() {
  // Mock data for our application
  const mockData = {
    schedule: [
      { id: 1, title: "Утренняя тренировка", date: "2025-09-21", time: "09:00", location: "Главное поле" },
      { id: 2, title: "Тренировка по ведению мяча", date: "2025-09-21", time: "15:00", location: "Зал №2" },
      { id: 3, title: "Физическая подготовка", date: "2025-09-22", time: "10:00", location: "Спортзал" },
      { id: 4, title: "Тактическая тренировка", date: "2025-09-22", time: "17:00", location: "Главное поле" }
    ],
    students: [
      { id: 1, name: "Иван Петров", age: 12, group: "Новички" },
      { id: 2, name: "Алексей Сидоров", age: 13, group: "Продвинутые" },
      { id: 3, name: "Михаил Козлов", age: 11, group: "Новички" },
      { id: 4, name: "Дмитрий Смирнов", age: 14, group: "Профессионалы" }
    ],
    news: [
      { id: 1, title: "Новое оборудование для тренировок", date: "2025-09-15", content: "Мы получили новое оборудование для тренировок, которое поможет улучшить навыки игроков." },
      { id: 2, title: "Победа на турнире", date: "2025-09-10", content: "Наша команда одержала победу в юношеском турнире по футболу!" },
      { id: 3, title: "Набор в группу новичков", date: "2025-09-05", content: "Открыт набор в группу новичков. Занятия начинаются 1 октября." }
    ],
    statistics: [
      { id: 1, student: "Иван Петров", skill: "Ведение мяча", level: 75 },
      { id: 2, student: "Иван Петров", skill: "Удар по воротам", level: 60 },
      { id: 3, student: "Алексей Сидоров", skill: "Ведение мяча", level: 85 },
      { id: 4, student: "Алексей Сидоров", skill: "Удар по воротам", level: 90 }
    ]
  };

  // Simple component to render
  function renderApp() {
    const root = document.getElementById('root');
    if (!root) return;
    
    // Hide loading screen
    const loadingContainer = document.getElementById('loadingContainer');
    if (loadingContainer) {
      loadingContainer.style.display = 'none';
    }
    
    // State for current view
    let currentView = 'dashboard';
    
    // Function to render different views
    function renderView(view) {
      currentView = view;
      updateActiveTab();
      
      switch(view) {
        case 'schedule':
          renderSchedule();
          break;
        case 'students':
          renderStudents();
          break;
        case 'statistics':
          renderStatistics();
          break;
        case 'news':
          renderNews();
          break;
        default:
          renderDashboard();
      }
    }
    
    // Update active tab styling
    function updateActiveTab() {
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      document.querySelector(`[data-view="${currentView}"]`)?.classList.add('active');
    }
    
    // Render dashboard view
    function renderDashboard() {
      root.innerHTML = `
        <div style="
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        ">
          <!-- Header -->
          <header style="
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1 style="color: #EF0107; margin: 0;">Футбольная школа "Арсенал"</h1>
              <button id="offlineButton" style="
                background: #EF0107;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
              " onclick="toggleOfflineMode()">Вы в онлайн режиме</button>
            </div>
          </header>
          
          <!-- Navigation -->
          <nav style="
            background: #333;
            padding: 0;
          ">
            <div style="display: flex; max-width: 800px; margin: 0 auto;">
              <div class="nav-item" data-view="dashboard" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('dashboard')">
                Главная
              </div>
              <div class="nav-item" data-view="schedule" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('schedule')">
                Расписание
              </div>
              <div class="nav-item" data-view="students" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('students')">
                Ученики
              </div>
              <div class="nav-item" data-view="statistics" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('statistics')">
                Статистика
              </div>
              <div class="nav-item" data-view="news" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('news')">
                Новости
              </div>
            </div>
          </nav>
          
          <!-- Main Content -->
          <main style="
            flex: 1;
            padding: 20px;
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            width: 100%;
          ">
            <div style="
              background: white;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              padding: 20px;
            ">
              <h2>Добро пожаловать в футбольную школу "Арсенал"!</h2>
              <p>Здесь вы можете управлять расписанием тренировок, отслеживать прогресс учеников и следить за новостями школы.</p>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
                <div style="
                  background: #f8f9fa;
                  border-radius: 8px;
                  padding: 15px;
                  text-align: center;
                  cursor: pointer;
                  transition: transform 0.2s;
                " onclick="renderView('schedule')">
                  <div style="font-size: 24px; margin-bottom: 10px;">📅</div>
                  <h3>Расписание</h3>
                  <p>${mockData.schedule.length} предстоящих тренировок</p>
                </div>
                
                <div style="
                  background: #f8f9fa;
                  border-radius: 8px;
                  padding: 15px;
                  text-align: center;
                  cursor: pointer;
                  transition: transform 0.2s;
                " onclick="renderView('students')">
                  <div style="font-size: 24px; margin-bottom: 10px;">👥</div>
                  <h3>Ученики</h3>
                  <p>${mockData.students.length} зарегистрированных учеников</p>
                </div>
                
                <div style="
                  background: #f8f9fa;
                  border-radius: 8px;
                  padding: 15px;
                  text-align: center;
                  cursor: pointer;
                  transition: transform 0.2s;
                " onclick="renderView('statistics')">
                  <div style="font-size: 24px; margin-bottom: 10px;">📊</div>
                  <h3>Статистика</h3>
                  <p>${mockData.statistics.length} записей прогресса</p>
                </div>
                
                <div style="
                  background: #f8f9fa;
                  border-radius: 8px;
                  padding: 15px;
                  text-align: center;
                  cursor: pointer;
                  transition: transform 0.2s;
                " onclick="renderView('news')">
                  <div style="font-size: 24px; margin-bottom: 10px;">📰</div>
                  <h3>Новости</h3>
                  <p>${mockData.news.length} последних новостей</p>
                </div>
              </div>
            </div>
          </main>
          
          <footer style="
            background: white;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          ">
            © 2025 Футбольная школа "Арсенал"
          </footer>
        </div>
      `;
    }
    
    // Render schedule view
    function renderSchedule() {
      let scheduleHTML = `
        <div style="
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        ">
          <!-- Header -->
          <header style="
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1 style="color: #EF0107; margin: 0;">Расписание тренировок</h1>
              <button id="offlineButton" style="
                background: #EF0107;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
              " onclick="toggleOfflineMode()">Вы в онлайн режиме</button>
            </div>
          </header>
          
          <!-- Navigation -->
          <nav style="
            background: #333;
            padding: 0;
          ">
            <div style="display: flex; max-width: 800px; margin: 0 auto;">
              <div class="nav-item" data-view="dashboard" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('dashboard')">
                Главная
              </div>
              <div class="nav-item active" data-view="schedule" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid #EF0107;
              " onclick="renderView('schedule')">
                Расписание
              </div>
              <div class="nav-item" data-view="students" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('students')">
                Ученики
              </div>
              <div class="nav-item" data-view="statistics" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('statistics')">
                Статистика
              </div>
              <div class="nav-item" data-view="news" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('news')">
                Новости
              </div>
            </div>
          </nav>
          
          <!-- Main Content -->
          <main style="
            flex: 1;
            padding: 20px;
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            width: 100%;
          ">
            <div style="
              background: white;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              padding: 20px;
            ">
              <h2>Предстоящие тренировки</h2>
              <div style="margin-top: 20px;">
      `;
      
      mockData.schedule.forEach(item => {
        scheduleHTML += `
          <div style="
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="margin: 0;">${item.title}</h3>
              <span style="background: #EF0107; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                ${item.date}
              </span>
            </div>
            <div style="display: flex; margin-top: 10px; color: #666;">
              <span style="margin-right: 20px;">⏰ ${item.time}</span>
              <span>📍 ${item.location}</span>
            </div>
          </div>
        `;
      });
      
      scheduleHTML += `
              </div>
            </div>
          </main>
          
          <footer style="
            background: white;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          ">
            © 2025 Футбольная школа "Арсенал"
          </footer>
        </div>
      `;
      
      root.innerHTML = scheduleHTML;
    }
    
    // Render students view
    function renderStudents() {
      let studentsHTML = `
        <div style="
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        ">
          <!-- Header -->
          <header style="
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1 style="color: #EF0107; margin: 0;">Ученики школы</h1>
              <button id="offlineButton" style="
                background: #EF0107;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
              " onclick="toggleOfflineMode()">Вы в онлайн режиме</button>
            </div>
          </header>
          
          <!-- Navigation -->
          <nav style="
            background: #333;
            padding: 0;
          ">
            <div style="display: flex; max-width: 800px; margin: 0 auto;">
              <div class="nav-item" data-view="dashboard" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('dashboard')">
                Главная
              </div>
              <div class="nav-item" data-view="schedule" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('schedule')">
                Расписание
              </div>
              <div class="nav-item active" data-view="students" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid #EF0107;
              " onclick="renderView('students')">
                Ученики
              </div>
              <div class="nav-item" data-view="statistics" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('statistics')">
                Статистика
              </div>
              <div class="nav-item" data-view="news" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('news')">
                Новости
              </div>
            </div>
          </nav>
          
          <!-- Main Content -->
          <main style="
            flex: 1;
            padding: 20px;
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            width: 100%;
          ">
            <div style="
              background: white;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              padding: 20px;
            ">
              <h2>Список учеников</h2>
              <div style="margin-top: 20px;">
      `;
      
      mockData.students.forEach(student => {
        studentsHTML += `
          <div style="
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div>
              <h3 style="margin: 0;">${student.name}</h3>
              <div style="color: #666; font-size: 14px; margin-top: 5px;">
                Возраст: ${student.age} лет | Группа: ${student.group}
              </div>
            </div>
            <button style="
              background: #EF0107;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
            ">
              Подробнее
            </button>
          </div>
        `;
      });
      
      studentsHTML += `
              </div>
            </div>
          </main>
          
          <footer style="
            background: white;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          ">
            © 2025 Футбольная школа "Арсенал"
          </footer>
        </div>
      `;
      
      root.innerHTML = studentsHTML;
    }
    
    // Render statistics view
    function renderStatistics() {
      let statisticsHTML = `
        <div style="
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        ">
          <!-- Header -->
          <header style="
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1 style="color: #EF0107; margin: 0;">Статистика прогресса</h1>
              <button id="offlineButton" style="
                background: #EF0107;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
              " onclick="toggleOfflineMode()">Вы в онлайн режиме</button>
            </div>
          </header>
          
          <!-- Navigation -->
          <nav style="
            background: #333;
            padding: 0;
          ">
            <div style="display: flex; max-width: 800px; margin: 0 auto;">
              <div class="nav-item" data-view="dashboard" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('dashboard')">
                Главная
              </div>
              <div class="nav-item" data-view="schedule" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('schedule')">
                Расписание
              </div>
              <div class="nav-item" data-view="students" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('students')">
                Ученики
              </div>
              <div class="nav-item active" data-view="statistics" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid #EF0107;
              " onclick="renderView('statistics')">
                Статистика
              </div>
              <div class="nav-item" data-view="news" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('news')">
                Новости
              </div>
            </div>
          </nav>
          
          <!-- Main Content -->
          <main style="
            flex: 1;
            padding: 20px;
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            width: 100%;
          ">
            <div style="
              background: white;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              padding: 20px;
            ">
              <h2>Прогресс учеников</h2>
              <div style="margin-top: 20px;">
      `;
      
      // Group statistics by student
      const studentStats = {};
      mockData.statistics.forEach(stat => {
        if (!studentStats[stat.student]) {
          studentStats[stat.student] = [];
        }
        studentStats[stat.student].push(stat);
      });
      
      Object.keys(studentStats).forEach(studentName => {
        statisticsHTML += `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">${studentName}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        `;
        
        studentStats[studentName].forEach(stat => {
          statisticsHTML += `
            <div style="
              border: 1px solid #eee;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            ">
              <h4 style="margin: 0 0 10px 0;">${stat.skill}</h4>
              <div style="
                width: 100%;
                background: #f0f0f0;
                border-radius: 10px;
                height: 20px;
                overflow: hidden;
              ">
                <div style="
                  width: ${stat.level}%;
                  background: #EF0107;
                  height: 100%;
                  border-radius: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 12px;
                ">
                  ${stat.level}%
                </div>
              </div>
            </div>
          `;
        });
        
        statisticsHTML += `
            </div>
          </div>
        `;
      });
      
      statisticsHTML += `
              </div>
            </div>
          </main>
          
          <footer style="
            background: white;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          ">
            © 2025 Футбольная школа "Арсенал"
          </footer>
        </div>
      `;
      
      root.innerHTML = statisticsHTML;
    }
    
    // Render news view
    function renderNews() {
      let newsHTML = `
        <div style="
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        ">
          <!-- Header -->
          <header style="
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1 style="color: #EF0107; margin: 0;">Новости школы</h1>
              <button id="offlineButton" style="
                background: #EF0107;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
              " onclick="toggleOfflineMode()">Вы в онлайн режиме</button>
            </div>
          </header>
          
          <!-- Navigation -->
          <nav style="
            background: #333;
            padding: 0;
          ">
            <div style="display: flex; max-width: 800px; margin: 0 auto;">
              <div class="nav-item" data-view="dashboard" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('dashboard')">
                Главная
              </div>
              <div class="nav-item" data-view="schedule" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('schedule')">
                Расписание
              </div>
              <div class="nav-item" data-view="students" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('students')">
                Ученики
              </div>
              <div class="nav-item" data-view="statistics" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid transparent;
              " onclick="renderView('statistics')">
                Статистика
              </div>
              <div class="nav-item active" data-view="news" style="
                padding: 15px 20px;
                color: white;
                cursor: pointer;
                border-bottom: 3px solid #EF0107;
              " onclick="renderView('news')">
                Новости
              </div>
            </div>
          </nav>
          
          <!-- Main Content -->
          <main style="
            flex: 1;
            padding: 20px;
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            width: 100%;
          ">
            <div style="
              background: white;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              padding: 20px;
            ">
              <h2>Последние новости</h2>
              <div style="margin-top: 20px;">
      `;
      
      mockData.news.forEach(item => {
        newsHTML += `
          <div style="
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          ">
            <h3 style="margin: 0 0 10px 0; color: #333;">${item.title}</h3>
            <div style="color: #666; font-size: 14px; margin-bottom: 15px;">
              📅 ${item.date}
            </div>
            <p style="margin: 0; line-height: 1.6;">${item.content}</p>
          </div>
        `;
      });
      
      newsHTML += `
              </div>
            </div>
          </main>
          
          <footer style="
            background: white;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          ">
            © 2025 Футбольная школа "Арсенал"
          </footer>
        </div>
      `;
      
      root.innerHTML = newsHTML;
    }
    
    // Initial render
    renderDashboard();
    
    // Add global functions
    window.renderView = renderView;
    window.toggleOfflineMode = function() {
      const button = document.getElementById('offlineButton');
      if (button.textContent === 'Вы в онлайн режиме') {
        button.textContent = 'Вы в оффлайн режиме';
        button.style.background = '#666';
      } else {
        button.textContent = 'Вы в онлайн режиме';
        button.style.background = '#EF0107';
      }
    };
  }
  
  // Render app when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
  } else {
    renderApp();
  }
})();