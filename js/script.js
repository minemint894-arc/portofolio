/* =====================================================
   E-PORTFOLIO PPG — ABDUL FITRAH MINE
   Navigasi halaman, modal refleksi, galeri, dan tema
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  if (window.AOS) {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }

  const loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () { loader.classList.add('hide'); }, 500);
  });
  setTimeout(function () { loader.classList.add('hide'); }, 2500);

  const sidebar = document.getElementById('sidebar');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const themeToggle = document.getElementById('themeToggle');
  const scrollProgress = document.getElementById('scrollProgress');
  const fabTop = document.getElementById('fabTop');
  const fabHelp = document.getElementById('fabHelp');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  let isDesktop = window.innerWidth > 768;

  function closeMobileNav() {
    sidebar.classList.remove('mobile-open');
    mobileOverlay.classList.remove('show');
  }
  mobileOverlay.addEventListener('click', closeMobileNav);

  const topbarToggle = document.getElementById('topbarToggle');
  const topbarNav = document.querySelector('.topbar-nav');
  if (topbarToggle && topbarNav) {
    topbarToggle.addEventListener('click', function () {
      const open = topbarNav.classList.toggle('open');
      topbarToggle.classList.toggle('open', open);
      topbarToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    topbarNav.querySelectorAll('.nav-link').forEach(function (l) {
      l.addEventListener('click', function () {
        if (l.classList.contains('dropdown-toggle')) return;
        topbarNav.classList.remove('open');
        topbarToggle.classList.remove('open');
        topbarToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- PAGE SWITCHING ---------- */
  const PAGE_IDS = ['beranda', 'profil', 'rancangan', 'pengalaman-s1', 'pengalaman-s2', 'karya-inovatif', 'refleksi-s1', 'refleksi-s2', 'refleksi', 'dokumentasi'];

  const navDropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

  function closeSubmenu() {
    navDropdowns.forEach(function (dd) {
      const sub = dd.querySelector('.nav-submenu');
      const tog = dd.querySelector('.dropdown-toggle');
      if (sub) sub.classList.remove('open');
      if (tog) tog.classList.remove('open');
      if (!isDesktop && sub && sub.style.position === 'fixed') sub.style.position = '';
    });
  }

  function openSubmenu(dd) {
    const sub = dd.querySelector('.nav-submenu');
    const tog = dd.querySelector('.dropdown-toggle');
    if (!sub || !tog) return;
    if (isDesktop) {
      const r = tog.getBoundingClientRect();
      sub.style.position = 'fixed';
      sub.style.top = (r.bottom + 6) + 'px';
      sub.style.left = Math.max(8, r.left) + 'px';
      sub.style.minWidth = '230px';
    }
    sub.classList.add('open');
    tog.classList.add('open');
  }

  function toggleSubmenu(dd) {
    const sub = dd.querySelector('.nav-submenu');
    if (sub.classList.contains('open')) closeSubmenu();
    else { closeSubmenu(); openSubmenu(dd); }
  }

  navDropdowns.forEach(function (dd) {
    const tog = dd.querySelector('.dropdown-toggle');
    if (!tog) return;
    tog.addEventListener('click', function (e) {
      e.preventDefault();
      toggleSubmenu(dd);
      if (!isDesktop) topbarNav.classList.add('open');
    });
  });

  document.addEventListener('click', function (e) {
    const insideAny = navDropdowns.some(function (dd) { return dd.contains(e.target); });
    if (!insideAny) closeSubmenu();
  });
  window.addEventListener('resize', function () {
    isDesktop = window.innerWidth > 768;
    if (isDesktop) {
      closeMobileNav();
      navDropdowns.forEach(function (dd) {
        const sub = dd.querySelector('.nav-submenu');
        if (sub && sub.classList.contains('open')) openSubmenu(dd);
      });
    } else {
      navDropdowns.forEach(function (dd) {
        const sub = dd.querySelector('.nav-submenu');
        if (sub) sub.style.position = '';
      });
    }
  });
  window.addEventListener('scroll', closeSubmenu, { passive: true });

  function getPrimarySection(link) {
    return link.getAttribute('data-section').split(',')[0].trim();
  }
  function linkMatchesSection(link, id) {
    return link.getAttribute('data-section').split(',').map(function (s) { return s.trim(); }).indexOf(id) !== -1;
  }
  function setActiveLink(id) {
    navLinks.forEach(function (l) {
      l.classList.toggle('active', linkMatchesSection(l, id));
    });
  }
  function currentPageFromHash() {
    const h = window.location.hash.replace('#', '');
    return PAGE_IDS.indexOf(h) !== -1 ? h : 'beranda';
  }
  function showPage(id) {
    if (PAGE_IDS.indexOf(id) === -1) id = 'beranda';
    sections.forEach(function (s) {
      s.classList.toggle('page-active', s.id === id);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
    setActiveLink(id);
    closeSubmenu();
    if (window.AOS) AOS.refresh();
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (link.classList.contains('dropdown-toggle')) return;
      e.preventDefault();
      const id = getPrimarySection(link);
      if (window.location.hash !== '#' + id) window.location.hash = id;
      showPage(id);
      if (!isDesktop) closeMobileNav();
    });
  });

  window.addEventListener('hashchange', function () {
    showPage(currentPageFromHash());
    if (!isDesktop) closeMobileNav();
  });

  showPage(currentPageFromHash());

  /* ---------- THEME ---------- */
  let darkMode = false;
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      darkMode = !darkMode;
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
      themeToggle.innerHTML = darkMode
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    });
  }

  /* ---------- SCROLL ---------- */
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
    if (fabTop) fabTop.classList.toggle('show', scrollTop > 400);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (fabTop) {
    fabTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (fabHelp) {
    fabHelp.addEventListener('click', function () { showPage('refleksi'); });
  }

  /* ---------- MODAL REFLEKSI ---------- */
  const LEJ_DATA = {
    filosofi: {
      title: 'Filosofi Pendidikan dan Pendidikan Nilai',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['Filosofi pendidikan mengingatkan saya bahwa guru bukan sekadar penyampai materi, tetapi penuntun yang membantu murid menemukan potensinya. Dalam pembelajaran kelistrikan, nilai kejujuran, ketelitian, dan tanggung jawab harus tumbuh bersama kompetensi teknis.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Tantangan saya adalah mengubah kebiasaan pembelajaran yang berorientasi pada hasil menjadi proses yang memberi ruang pada eksplorasi, kesalahan yang aman, dan refleksi.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Guru sebagai teladan dan fasilitator yang memahami kodrat serta konteks murid. Pembelajaran harus bermakna, menghargai keberagaman, dan menghubungkan materi dengan kehidupan serta dunia kerja.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya mulai merancang pembelajaran yang lebih berpusat pada murid, membuka diskusi, dan menjadikan keselamatan kerja sebagai bagian dari pendidikan nilai.'] }
      ]
    },
    pemahaman: {
      title: 'Pemahaman Peserta Didik dan Pembelajarannya',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['Setiap murid datang dengan kesiapan, minat, dan pengalaman yang berbeda. Pemahaman ini menjadi dasar bagi saya untuk tidak menyamakan perlakuan di kelas kelistrikan.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Tantangan terbesar adalah menghadapi murid yang cepat bosan, takut mencoba, atau kesulitan memahami diagram rangkaian tanpa membuat mereka merasa tertinggal.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Asesmen awal, pembelajaran berdiferensiasi, dan pemahaman perkembangan kognitif serta sosial-emosional membantu saya merancang aktivitas yang lebih sesuai.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya menyediakan demonstrasi bertahap, alat bantu visual, dan pendampingan sesuai kebutuhan. Saya juga lebih sering memberi umpan balik yang spesifik daripada sekadar menilai hasil akhir.'] }
      ]
    },
    'pembelajaran-dasar': {
      title: 'Pembelajaran Mendalam dan Asesmen Dasar',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['Pembelajaran mendalam membantu saya melihat bahwa memahami rangkaian bukan hanya menghafal simbol, tetapi mampu menjelaskan prinsip, memprediksi hasil, dan memperbaiki kesalahan.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Saya perlu mengubah pembelajaran yang terlalu didominasi demonstrasi guru menjadi aktivitas yang membuat murid berpikir, mencoba, dan merefleksikan proses kerjanya.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Asesmen harus menjadi bagian dari pembelajaran. Diagnostik, formatif, dan sumatif saling melengkapi untuk memberi gambaran utuh tentang perkembangan murid.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya merancang pertanyaan pemantik, lembar kerja, dan rubrik yang menilai proses serta keselamatan kerja, bukan hanya produk akhir.'] }
      ]
    },
    'design-thinking': {
      title: 'Design Thinking',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['Design Thinking mengajarkan saya memahami masalah pembelajaran sebelum menentukan solusi. Kebutuhan murid menjadi titik awal, bukan asumsi guru.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Tantangannya adalah menahan diri untuk langsung memberi solusi dan terbiasa menggali akar masalah melalui observasi serta wawancara.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Empathize, define, ideate, prototype, dan test menjadi alur kerja yang membantu saya merancang media serta aktivitas secara lebih terarah.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya mulai menguji ide media pembelajaran bersama murid, meminta umpan balik, dan memperbaiki prototipe berdasarkan pengalaman penggunaan.'] }
      ]
    },
    growth: {
      title: 'Pola Pikir Bertumbuh (Growth Mindset)',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['Pola pikir bertumbuh membuat saya memandang kesulitan belajar sebagai proses, bukan bukti ketidakmampuan. Hal ini berlaku bagi murid maupun bagi saya sebagai calon guru.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Tantangan saya adalah mengubah cara memberi umpan balik agar murid tidak takut salah, terutama saat melakukan praktikum yang berisiko.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Kemampuan dapat berkembang melalui usaha, strategi yang tepat, latihan, kolaborasi, dan refleksi. Pujian sebaiknya diarahkan pada proses dan strategi.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya membiasakan murid mencoba ulang, membandingkan strategi, dan menuliskan pelajaran dari kesalahan. Saya juga lebih terbuka terhadap kritik untuk memperbaiki cara mengajar.'] }
      ]
    },
    'ppl-terbimbing': {
      title: 'Praktik Pengalaman Lapangan Terbimbing',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['PPL Terbimbing menjadi jembatan antara teori pedagogik dan kenyataan kelas. Saya belajar merencanakan, melaksanakan, dan mengevaluasi pembelajaran secara utuh.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Dinamika kelas sering berbeda dari rencana: waktu praktik terbatas, alat harus bergantian, dan perhatian murid mudah teralih.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Manajemen kelas yang konstruktif, instruksi yang jelas, demonstrasi bertahap, serta refleksi bersama guru pamong menjadi kunci perbaikan.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya menyusun langkah kerja yang lebih sederhana, menambah pengawasan pada titik berisiko, dan menutup pembelajaran dengan refleksi singkat.'] }
      ]
    },
    pse: {
      title: 'Pembelajaran Sosial dan Emosional',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['PSE membantu saya memahami bahwa kelas yang aman secara emosional membuat murid lebih berani mencoba dan bertanya, termasuk saat praktik kelistrikan.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Saya harus mengelola emosi sendiri ketika pembelajaran tidak sesuai rencana, serta menghadapi murid dengan kepercayaan diri dan pengalaman yang berbeda.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Lima kompetensi CASEL menjadi bekal untuk mengenali emosi, mengelola diri, memahami orang lain, membangun relasi, dan mengambil keputusan yang bertanggung jawab.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya membiasakan pembukaan kelas yang tenang, kesepakatan kerja, apresiasi proses, dan komunikasi yang tidak menghakimi ketika murid melakukan kesalahan.'] }
      ]
    },
    'asesmen-lanjut': {
      title: 'Pembelajaran Mendalam dan Asesmen Lanjut',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['Asesmen lanjut membantu saya melihat perkembangan murid secara lebih utuh dan menggunakan data untuk menentukan tindak lanjut, bukan hanya memberi nilai.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Mengolah hasil asesmen menjadi keputusan pembelajaran yang tepat membutuhkan waktu dan kejelasan kriteria.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Asesmen berkelanjutan, rubrik yang jelas, serta pengayaan dan remedial berbasis kebutuhan murid menjadi fokus pembelajaran ini.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya menyusun instrumen yang lebih terarah, menganalisis kesulitan murid, dan merancang pendampingan bagi kelompok yang membutuhkan penguatan.'] }
      ]
    },
    kepemimpinan: {
      title: 'Proyek Kepemimpinan',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['Kepemimpinan pendidikan berarti kemampuan menggerakkan orang lain menuju perubahan yang bermanfaat, bukan sekadar memegang jabatan.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Keterbatasan waktu, sumber daya, dan koordinasi menjadi tantangan dalam merancang proyek yang berdampak.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Kolaborasi, komunikasi, keteladanan, dan perencanaan yang jelas membantu saya mengelola proyek secara lebih realistis.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya belajar membagi peran, mendokumentasikan proses, dan melibatkan pihak terkait agar proyek tidak berhenti pada ide.'] }
      ]
    },
    edupreneurship: {
      title: 'Edupreneurship',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['Edupreneurship menumbuhkan keberanian untuk menciptakan nilai dari keterbatasan. Media pembelajaran dapat menjadi solusi yang bermanfaat sekaligus berkelanjutan.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Tantangannya adalah mengubah ide menjadi produk yang benar-benar dibutuhkan, mudah digunakan, dan relevan dengan pembelajaran.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Kreativitas, kemandirian, kepekaan terhadap kebutuhan, dan kemampuan mengevaluasi nilai manfaat menjadi dasar pengembangan karya.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya belajar menyusun konsep karya secara lebih realistis, menguji manfaatnya, dan membuka diri terhadap masukan pengguna.'] }
      ]
    },
    'ppl-mandiri': {
      title: 'Praktik Pengalaman Lapangan Mandiri',
      blocks: [
        { icon: 'fa-link', heading: 'Connection', html: ['PPL Mandiri menjadi puncak penerapan seluruh pengalaman belajar, dari perencanaan hingga evaluasi pembelajaran di kelas dan bengkel.'] },
        { icon: 'fa-triangle-exclamation', heading: 'Challenge', html: ['Saya dituntut mengambil keputusan secara mandiri, mengelola kelas yang kompleks, dan menyesuaikan pembelajaran dengan kondisi nyata.'] },
        { icon: 'fa-lightbulb', heading: 'Concept', html: ['Perencanaan yang fleksibel, instruksi yang jelas, asesmen proses, dan refleksi berkelanjutan membantu menjaga kualitas pembelajaran.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change', html: ['Saya mampu merancang perangkat ajar yang lebih utuh, mengelola praktik dengan lebih aman, dan memperbaiki pembelajaran berdasarkan umpan balik.'] }
      ]
    },
    lk1: {
      title: 'LK 1 — Identifikasi Diri',
      blocks: [
        { icon: 'fa-flag', heading: 'Visi Pendidikan', html: ['Pendidikan vokasi yang merata dan bermutu, mampu membekali murid dengan kompetensi, karakter, dan kesadaran keselamatan kerja yang relevan dengan dunia industri.'] },
        { icon: 'fa-eye', heading: 'Visi Menjadi Guru', html: ['Menjadi guru kelistrikan yang menumbuhkan rasa ingin tahu, ketelitian, dan keberanian mencoba dalam lingkungan belajar yang aman dan inklusif.'] },
        { icon: 'fa-bullseye', heading: 'Strategi', html: ['<ul><li>Memetakan kebutuhan belajar murid melalui asesmen awal.</li><li>Menghubungkan materi dengan praktik dan standar industri.</li><li>Mengembangkan media pembelajaran interaktif seperti EduKelistrikan.</li><li>Membiasakan refleksi dan kolaborasi dengan guru pamong.</li></ul>'] }
      ]
    },
    lk2s1: {
      title: 'LK 2 — Refleksi Mata Kuliah Semester 1',
      blocks: [
        { icon: 'fa-link', heading: 'Pemahaman Peserta Didik', html: ['Saya belajar bahwa kesiapan, minat, dan cara belajar murid berbeda. Pembelajaran kelistrikan perlu memberi pilihan representasi, waktu, dan pendampingan yang sesuai.'] },
        { icon: 'fa-lightbulb', heading: 'Design Thinking', html: ['Masalah pembelajaran perlu dipahami sebelum solusi dirancang. Observasi dan umpan balik murid membantu saya mengembangkan media yang lebih tepat guna.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Perubahan', html: ['Saya mulai merancang aktivitas yang lebih berpusat pada murid, menggunakan demonstrasi bertahap, dan menilai proses belajar tidak hanya hasil akhir.'] }
      ]
    },
    lk2s2: {
      title: 'LK 2 — Refleksi Mata Kuliah Semester 2',
      blocks: [
        { icon: 'fa-heart', heading: 'Pembelajaran Sosial Emosional', html: ['Kelas yang aman secara emosional membuat murid lebih berani bertanya dan mencoba. Saya belajar mengelola emosi, mendengarkan, dan memberi umpan balik yang membangun.'] },
        { icon: 'fa-people-group', heading: 'Kepemimpinan dan Kolaborasi', html: ['Proyek kepemimpinan mengajarkan pentingnya komunikasi, pembagian peran, dan keterlibatan pihak terkait agar perubahan dapat berjalan.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Perubahan', html: ['Saya lebih konsisten membangun kesepakatan kelas, mengapresiasi proses, dan menjadikan keselamatan kerja sebagai bagian dari budaya belajar.'] }
      ]
    },
    lk3: {
      title: 'LK 3 — Refleksi Keseluruhan PPG',
      blocks: [
        { icon: 'fa-book-open', heading: 'Refleksi Pengalaman Belajar', html: ['Pendidikan seharusnya merata, bermutu, dan berpihak pada kebutuhan murid. Guru perlu memahami karakteristik murid, menciptakan lingkungan belajar yang aman, serta terus mengembangkan kompetensi dan inovasi.'] },
        { icon: 'fa-route', heading: 'Tiga Langkah Awal', html: ['<ul><li>Mengenal murid melalui asesmen awal dan komunikasi.</li><li>Membangun kelas yang aman, disiplin, dan peduli K3.</li><li>Terus belajar, berefleksi, dan memperbaiki pembelajaran.</li></ul>'] }
      ]
    },
    lk4: {
      title: 'LK 4 — Desain Karya Inovatif EduKelistrikan',
      blocks: [
        { icon: 'fa-cube', heading: 'Karya', html: ['EduKelistrikan adalah bengkel virtual TITL yang memuat 15 model alat 3D, simulasi praktikum kendali motor, K3/LOTO, kuis, refleksi, dan dashboard guru.'] },
        { icon: 'fa-lightbulb', heading: 'Latar Belakang', html: ['Keterbatasan alat dan waktu praktik membuat murid membutuhkan pengalaman visual serta latihan yang aman dan dapat diulang sebelum praktik nyata.'] },
        { icon: 'fa-arrow-right-arrow-left', heading: 'Rencana Pengembangan', html: ['Memperbaiki akurasi simulasi, menguatkan asesmen, mengukur dampak belajar, dan menyempurnakan pengalaman pengguna bersama guru serta murid.'] }
      ]
    }
  };

  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  function openLejModal(mkId) {
    const data = LEJ_DATA[mkId];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.blocks.map(function (b) {
      return '<div class="lej-modal-block">' +
        '<h4><i class="fa-solid ' + b.icon + '"></i> ' + b.heading + '</h4>' +
        b.html.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
        '</div>';
    }).join('');
    modalOverlay.classList.add('show');
  }

  document.querySelectorAll('.lej-more[data-mk]').forEach(function (btn) {
    btn.addEventListener('click', function () { openLejModal(btn.getAttribute('data-mk')); });
  });

  function closeModal() { modalOverlay.classList.remove('show'); }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- LIGHTBOX GALERI ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let lightboxEl, lightboxImg, lightboxClose, lightboxPrev, lightboxNext;
  let currentIndex = -1;

  function ensureLightbox() {
    if (lightboxEl || !galleryItems.length) return;
    lightboxEl = document.createElement('div');
    lightboxEl.className = 'lightbox';
    lightboxEl.innerHTML =
      '<button class="lightbox-close" aria-label="Tutup">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Sebelumnya">&#10094;</button>' +
      '<button class="lightbox-next" aria-label="Berikutnya">&#10095;</button>' +
      '<figure class="lightbox-figure"><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lightboxEl);
    lightboxImg = lightboxEl.querySelector('img');
    lightboxClose = lightboxEl.querySelector('.lightbox-close');
    lightboxPrev = lightboxEl.querySelector('.lightbox-prev');
    lightboxNext = lightboxEl.querySelector('.lightbox-next');
    const caption = lightboxEl.querySelector('figcaption');

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); showLightbox(currentIndex - 1); });
    lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); showLightbox(currentIndex + 1); });
    lightboxEl.addEventListener('click', function (e) { if (e.target === lightboxEl) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lightboxEl.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { showLightbox(currentIndex - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { showLightbox(currentIndex + 1); e.preventDefault(); }
    });

    function showLightbox(idx) {
      const items = galleryItems.filter(function (i) { return i.closest('#dokumentasi'); });
      currentIndex = (idx + items.length) % items.length;
      const item = items[currentIndex];
      lightboxImg.src = item.href;
      lightboxImg.alt = item.querySelector('img').alt;
      caption.textContent = item.dataset.alt || '';
      lightboxPrev.style.display = items.length > 1 ? '' : 'none';
      lightboxNext.style.display = items.length > 1 ? '' : 'none';
      lightboxEl.classList.add('open');
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        showLightbox(galleryItems.indexOf(item));
      });
    });
  }

  function closeLightbox() {
    if (lightboxEl) {
      lightboxEl.classList.remove('open');
      lightboxImg.src = '';
    }
  }

  ensureLightbox();

  /* ---------- SCROLL TO IN-PAGE SECTION ---------- */
  document.querySelectorAll('[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- READ MORE ---------- */
  document.querySelectorAll('.mgj-toggle').forEach(function (btn) {
    const more = document.getElementById(btn.getAttribute('data-target'));
    if (!more) return;
    const closedLabel = btn.innerHTML;
    btn.addEventListener('click', function () {
      const isHidden = more.style.display === 'none';
      more.style.display = isHidden ? 'block' : 'none';
      btn.innerHTML = isHidden
        ? '<i class="fa-solid fa-chevron-up"></i> Tutup'
        : closedLabel;
    });
  });

});
