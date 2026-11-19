// Englify — courses
  // --- KURSLAR, LUG'AT & PROFIL ---
  function filterCourses(cat, el){
    document.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active'));
    if(el) el.classList.add('active');
    const cards = document.querySelectorAll('.dash-course-card');
    cards.forEach(card=>{
      const cats = card.getAttribute('data-category') || '';
      if(cat === 'all' || cats.includes(cat)) card.style.display = 'flex';
      else card.style.display = 'none';
    });
  }

  function openCourseDetails(c){
    // General English — onlayn darslik (YouTube playlist)
    if(c === 'General English'){
      window.open('https://youtu.be/d-fvgkbTED0?list=PLkREkayoYCyI9KGsZ2TfeVccRv9zqP0gl&t=5', '_blank');
      return;
    }
    alert('"' + c + '" darslariga xush kelibsiz!');
  }
  function openCourseSyllabus(c){
    document.getElementById('modal-course-title').textContent = c + " — Sillabus";
    document.getElementById('modal-course-content').innerHTML = `<p>Kurs dasturi to'liq xalqaro standartlar asosida tuzilgan. Haftada 3 kun 1.5 soatdan o'tiladi.</p>`;
    document.getElementById('modal-syllabus').style.display = 'flex';
  }
