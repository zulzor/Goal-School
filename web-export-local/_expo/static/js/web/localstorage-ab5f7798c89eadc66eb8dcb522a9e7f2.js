__d(
  function (g, r, i, a, m, e, d) {
    (Object.defineProperty(e, '__esModule', { value: !0 }), (e.localQuery = void 0));
    const t = {
      profiles: [
        {
          id: 'user1',
          email: 'admin1@gs.com',
          name: '\u0418\u0432\u0430\u043d \u0418\u0432\u0430\u043d\u043e\u0432',
          role: 'child',
          avatar_url: null,
          phone: '+79991234567',
          date_of_birth: '2010-05-15',
          parent_id: 'parent1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'parent1',
          email: 'parent1@gs.com',
          name: '\u0410\u043b\u0435\u043a\u0441\u0435\u0439 \u0418\u0432\u0430\u043d\u043e\u0432',
          role: 'parent',
          avatar_url: null,
          phone: '+79991234568',
          date_of_birth: null,
          parent_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'coach1',
          email: 'coach1@gs.com',
          name: '\u041c\u0438\u0445\u0430\u0438\u043b \u041f\u0435\u0442\u0440\u043e\u0432',
          role: 'coach',
          avatar_url: null,
          phone: '+79991234569',
          date_of_birth: null,
          parent_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'manager1',
          email: 'manager1@gs.com',
          name: '\u0421\u0435\u0440\u0433\u0435\u0439 \u0421\u0438\u0434\u043e\u0440\u043e\u0432',
          role: 'manager',
          avatar_url: null,
          phone: '+79991234570',
          date_of_birth: null,
          parent_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      trainings: [
        {
          id: 'training1',
          title:
            '\u0422\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0430 \u043f\u043e \u0442\u0435\u0445\u043d\u0438\u043a\u0435 \u0432\u043b\u0430\u0434\u0435\u043d\u0438\u044f \u043c\u044f\u0447\u043e\u043c',
          description:
            '\u041e\u0442\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u0431\u0430\u0437\u043e\u0432\u044b\u0445 \u043d\u0430\u0432\u044b\u043a\u043e\u0432 \u0432\u043b\u0430\u0434\u0435\u043d\u0438\u044f \u043c\u044f\u0447\u043e\u043c',
          date: new Date(Date.now() + 864e5).toISOString().split('T')[0],
          start_time: '17:00',
          end_time: '18:30',
          location: '\u0413\u043b\u0430\u0432\u043d\u043e\u0435 \u043f\u043e\u043b\u0435',
          coach_id: 'coach1',
          max_participants: 20,
          age_group: 'U12',
          type: 'technical',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'training2',
          title:
            '\u0424\u0438\u0437\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430',
          description:
            '\u041a\u043e\u043c\u043f\u043b\u0435\u043a\u0441 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0439 \u0434\u043b\u044f \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f \u0432\u044b\u043d\u043e\u0441\u043b\u0438\u0432\u043e\u0441\u0442\u0438',
          date: new Date(Date.now() + 1728e5).toISOString().split('T')[0],
          start_time: '16:00',
          end_time: '17:00',
          location: '\u0424\u0438\u0442\u043d\u0435\u0441-\u0446\u0435\u043d\u0442\u0440',
          coach_id: 'coach1',
          max_participants: 15,
          age_group: 'U14',
          type: 'physical',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      training_registrations: [
        {
          id: 'reg1',
          training_id: 'training1',
          user_id: 'user1',
          status: 'registered',
          registered_at: new Date().toISOString(),
        },
      ],
      news: [
        {
          id: 'news1',
          title:
            '\u041d\u043e\u0432\u0430\u044f \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043e\u0447\u043d\u0430\u044f \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430',
          content:
            '\u041c\u044b \u0440\u0430\u0434\u044b \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u0432\u0443\u044e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0443 \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043e\u043a, \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u043d\u0443\u044e \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u043e \u0434\u043b\u044f \u043d\u0430\u0448\u0435\u0439 \u0444\u0443\u0442\u0431\u043e\u043b\u044c\u043d\u043e\u0439 \u0448\u043a\u043e\u043b\u044b.',
          excerpt:
            '\u041f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u043c \u043d\u043e\u0432\u0443\u044e \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043e\u0447\u043d\u0443\u044e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0443',
          image_url: null,
          author_id: 'manager1',
          is_important: !0,
          tags: [
            '\u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0438',
            '\u043d\u043e\u0432\u043e\u0441\u0442\u0438',
          ],
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'news2',
          title:
            '\u041f\u043e\u0431\u0435\u0434\u0430 \u0432 \u0442\u0443\u0440\u043d\u0438\u0440\u0435',
          content:
            '\u041d\u0430\u0448\u0438 \u044e\u043d\u044b\u0435 \u0444\u0443\u0442\u0431\u043e\u043b\u0438\u0441\u0442\u044b \u043e\u0434\u0435\u0440\u0436\u0430\u043b\u0438 \u043f\u043e\u0431\u0435\u0434\u0443 \u0432 \u0433\u043e\u0440\u043e\u0434\u0441\u043a\u043e\u043c \u0442\u0443\u0440\u043d\u0438\u0440\u0435!',
          excerpt:
            '\u041f\u043e\u0437\u0434\u0440\u0430\u0432\u043b\u044f\u0435\u043c \u043f\u043e\u0431\u0435\u0434\u0438\u0442\u0435\u043b\u0435\u0439 \u0433\u043e\u0440\u043e\u0434\u0441\u043a\u043e\u0433\u043e \u0442\u0443\u0440\u043d\u0438\u0440\u0430',
          image_url: null,
          author_id: 'manager1',
          is_important: !1,
          tags: ['\u0442\u0443\u0440\u043d\u0438\u0440', '\u043f\u043e\u0431\u0435\u0434\u0430'],
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      nutrition_recommendations: [
        {
          id: 'nut1',
          title:
            '\u041f\u0438\u0442\u0430\u043d\u0438\u0435 \u043f\u0435\u0440\u0435\u0434 \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u043e\u0439',
          description:
            '\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0438 \u043f\u043e \u043f\u0438\u0442\u0430\u043d\u0438\u044e \u043f\u0435\u0440\u0435\u0434 \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u043e\u0439 \u0434\u043b\u044f \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0439 \u044d\u0444\u0444\u0435\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u0438',
          category: 'before_training',
          age_group: 'U12',
          tips: [
            '\u0417\u0430 2-3 \u0447\u0430\u0441\u0430 \u0434\u043e \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0438 \u0441\u044a\u0435\u0448\u044c\u0442\u0435 \u043b\u0435\u0433\u043a\u043e\u0443\u0441\u0432\u043e\u044f\u0435\u043c\u044b\u0439 \u043e\u0431\u0435\u0434',
            '\u0417\u0430 30 \u043c\u0438\u043d\u0443\u0442 \u0434\u043e \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0438 \u043c\u043e\u0436\u043d\u043e \u0432\u044b\u043f\u0438\u0442\u044c \u0431\u0430\u043d\u0430\u043d',
            '\u0418\u0437\u0431\u0435\u0433\u0430\u0439\u0442\u0435 \u0442\u044f\u0436\u0435\u043b\u043e\u0439 \u043f\u0438\u0449\u0438 \u043f\u0435\u0440\u0435\u0434 \u043d\u0430\u0433\u0440\u0443\u0437\u043a\u043e\u0439',
          ],
          image_url: null,
          author_id: 'manager1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      disciplines: [
        {
          id: 'disc1',
          name: '\u0411\u0435\u0433 \u043d\u0430 30 \u043c\u0435\u0442\u0440\u043e\u0432',
          description:
            '\u0421\u043f\u0440\u0438\u043d\u0442 \u043d\u0430 \u043a\u043e\u0440\u043e\u0442\u043a\u0443\u044e \u0434\u0438\u0441\u0442\u0430\u043d\u0446\u0438\u044e',
          unit: '\u0441\u0435\u043a\u0443\u043d\u0434\u044b',
          is_active: !0,
          created_by: 'coach1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'disc2',
          name: '\u041f\u043e\u0434\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u044f',
          description:
            '\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u043f\u043e\u0434\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u0439 \u0437\u0430 \u043e\u0434\u0438\u043d \u043f\u043e\u0434\u0445\u043e\u0434',
          unit: '\u0440\u0430\u0437',
          is_active: !0,
          created_by: 'coach1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      discipline_results: [
        {
          id: 'res1',
          discipline_id: 'disc1',
          user_id: 'user1',
          result_value: 5.2,
          age_group: 'U12',
          standard_result: 4.8,
          coach_id: 'coach1',
          date_recorded: new Date().toISOString().split('T')[0],
          is_archived: !1,
          notes:
            '\u0425\u043e\u0440\u043e\u0448\u0438\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442',
          created_at: new Date().toISOString(),
        },
      ],
    };
    e.localQuery = async (n, o = []) => {
      try {
        (console.log('Local query:', n, o), await new Promise(t => setTimeout(t, 100)));
        const s = n.toLowerCase();
        if (s.startsWith('select')) {
          const s = n.match(/FROM\s+(\w+)/i);
          if (s) {
            const c = s[1];
            let l = [...(t[c] || [])];
            const _ = n.match(/WHERE\s+([^$]+)/i);
            if (_ && o.length > 0) {
              const t = _[1];
              t.includes('id = $1')
                ? (l = l.filter(t => t.id === o[0]))
                : t.includes('training_id = $1')
                  ? (l = l.filter(t => t.training_id === o[0]))
                  : t.includes('user_id = $1')
                    ? (l = l.filter(t => t.user_id === o[0]))
                    : t.includes('student_id = $1') && (l = l.filter(t => t.student_id === o[0]));
            }
            const u = n.match(/LIMIT\s+(\d+)/i);
            if (u) {
              const t = parseInt(u[1]);
              l = l.slice(0, t);
            }
            return { rows: l, rowCount: l.length };
          }
        }
        if (s.startsWith('insert')) {
          const t = n.match(/INTO\s+(\w+)/i);
          if (t) {
            t[1];
            return { rows: [], rowCount: 0 };
          }
        }
        if (s.startsWith('update')) {
          const t = n.match(/UPDATE\s+(\w+)/i);
          if (t) {
            t[1];
            return { rows: [], rowCount: 0 };
          }
        }
        if (s.startsWith('delete')) {
          const t = n.match(/FROM\s+(\w+)/i);
          if (t) {
            t[1];
            return { rows: [], rowCount: 0 };
          }
        }
        return { rows: [], rowCount: 0 };
      } catch (t) {
        throw (console.error('Local query error:', t), t);
      }
    };
  },
  1245,
  []
);
