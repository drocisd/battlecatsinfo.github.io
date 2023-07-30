var stage_name = '';
var fs;
const M1 = document.getElementById('M1');
const M2 = document.getElementById('M2');
const M3 = document.getElementById('M3');
const st1 = document.getElementById('st-1').children;
const st2 = document.getElementById('st-2').children;
const st3 = document.getElementById('st-3').children;
const stName = document.getElementById('st-name');
const stName2 = document.getElementById('st-name2');
const stLines = document.getElementById('lines');
const main_div = document.getElementById('main');
const search_result = document.getElementById('search-result');
var info1, info2, info3;
var enemy_names;
var star;
var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
BrowserFS.install(window);
fetch('enemyName.json').then(res => res.json()).then(json => enemy_names = json).then(function() {
fetch('/stages.zip').then(res => res.arrayBuffer()).then(function(zipData) {
  BrowserFS.configure({
    fs: "ZipFS",
    options: { 'zipData': Buffer.from(zipData) }
  }, function(e) {
    if (e) {
      console.error(e);
      return;
    }
    fs = BrowserFS.BFSRequire('fs');
    fs.readdirSync('/stages').forEach(m1 => {
      const p = document.createElement('option');
      const info = JSON.parse(fs.readFileSync((p.value = `/stages/${m1}`) + '/info', 'utf-8', 'r'));
      p.innerText = [info.name, info.jpname].filter(x => x).join('/');
      M1.appendChild(p);
    });
    const url = new URL(location.href);
    const stars = url.searchParams.get('star');
    if (stars) {
      star = parseInt(stars);
      if (isNaN(star) || star <= 0 || star > 4)
        star = 1;
    } else {
      star = 1;
    }
    const st = url.searchParams.get('s');
    if (st) {
      const sts = st.split('-').map(x => parseInt(x)).filter(x => !isNaN(x));
      if (sts.length) {
        M1.selectedIndex = sts[0];
        M1.oninput(null, sts);
        main_div.style.display = 'block';
        return;
      }
    }
    M1.selectedIndex = 0;
    M1.oninput();
    main_div.style.display = 'block';
  });
});
});
M1.oninput = function(event, sts) {
  const dir = M1.selectedOptions[0].value;
  info1 = JSON.parse(fs.readFileSync(dir + '/info'));
  M2.textContent = '';
  M3.textContent = '';
  fs.readdirSync(dir).forEach(m1 => {
    if (m1 == 'info') return;
    const p = document.createElement('option');
    const info = JSON.parse(fs.readFileSync((p.value = dir + '/' + m1) + '/info', 'utf-8', 'r'));
    p.innerText = [info.name, info.jpname].filter(x => x).join('/');
    M2.appendChild(p);
  });
  if (sts && sts.length > 1)
    M2.selectedIndex = sts[1];
  else
    M2.selectedIndex = 0;
  M2.oninput(null, sts);
}
M2.oninput = function(event, sts) {
  const dir = M2.selectedOptions[0].value;
  info2 = JSON.parse(fs.readFileSync(dir + '/info'));
  M3.textContent = '';
  fs.readdirSync(dir).forEach(m1 => {
    if (m1 == 'info') return;
    const p = document.createElement('option');
    const info = JSON.parse(fs.readFileSync((p.value = dir + '/' + m1), 'utf-8', 'r'));
    p.innerText = [info.name, info.jpname].filter(x => x).join('/');
    M3.appendChild(p);
  });
  if (sts && sts.length > 2)
    M3.selectedIndex = sts[2];
  else
    M3.selectedIndex = 0;
  M3.oninput();
}
function makeTd(p, txt) {
  const td = document.createElement('td');
  td.innerText = txt;
  p.appendChild(td);
}
function t3str(x) {
  let s = x.toString();
  switch (s.length) {
  case 2: return '0' + s;
  case 1: return '00' + s;
  }
  return s;
}
M3.oninput = function() {
  const dir = M3.selectedOptions[0].value;
  const url = new URL(location.href);
  url.searchParams.set('s', [M1.selectedIndex, M2.selectedIndex, M3.selectedIndex].join('-'));
  history.pushState({}, "", url);
  info3 = JSON.parse(fs.readFileSync(dir));
  stName.innerText = stage_name = [info1.name, info2.name, info3.name].join(' • ');
  stName2.innerText = [info1.jpname, info2.jpname, info3.jpname].join(' • ');
  document.title = stage_name;
  const stars_tr = document.getElementById('stars-tr');
  if (stars_tr)
    stars_tr.parentNode.removeChild(stars_tr);
  if (info2.stars.length) {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.colSpan = 6;
    for (let i = 0;i < info2.stars.length;++i) {
      const a = document.createElement('a');
      a.classList.add('star');
      a.innerText = (i+1).toString() + '★: ' + info2.stars[i].toString() + '%';
      url.searchParams.set('star', i+1);
      a.href = url.href;
      th.appendChild(a);
    }
    tr.appendChild(th);
    tr.id = 'stars-tr';
    stName.parentNode.parentNode.appendChild(tr);
  }
  let mult = info2.stars[star - 1];
  if (!mult) {
    mult = 1;
  } else {
    mult *= 0.01;
  }
  st1[1].innerText = info3.energy;
  st1[3].innerText = info3.max;
  st1[5].innerText = info3.len;
  st2[1].innerText = info3.health;
  const ca = document.createElement('a');
  const cas = t3str(info3.castle % 1000);
  const cad = ["rc", "ec", "wc", "sc"][Math.floor(info3.castle / 1000)];
  ca.href = '/data/img/' + cad + '/' + cad  + cas + '.png';
  ca.innerText = cas;
  st2[3].textContent = '';
  st2[3].appendChild(ca);
  const a = document.createElement('a');
  a.href = '/data/img/bg/bg' + t3str(info3.bg) + '.png';
  a.innerText = t3str(info3.bg);
  st2[5].textContent = '';
  st2[5].appendChild(a);
  st3[1].innerText = info3.xp;
  const a1 = document.createElement('a');
  a1.innerText = t3str(info3.mus0);
  a1.href = 'https://github.com/battlecatsultimate/bcu-assets/raw/master/music/' + t3str(info3.mus0) + '.ogg';
  const a2 = document.createElement('a');
  a2.innerText = t3str(info3.mus1);
  a2.href = 'https://github.com/battlecatsultimate/bcu-assets/raw/master/music/' + t3str(info3.mus1) + '.ogg';
  st3[3].textContent = '';
  st3[3].appendChild(a1);
  st3[5].textContent = '';
  st3[5].appendChild(a2);
  stLines.textContent = '';
  for (let line of info3.lines) {
    const tr = document.createElement('tr');
    const enemy = line[0];
    makeTd(tr, enemy_names[enemy]);
    const img = new Image(85, 32);
    const a = document.createElement('a');
    a.href = `/enemy.html?id=${enemy}&mag=${(line[9] || 100) * mult}`;
    s = t3str(enemy)
    img.src = '/data/enemy/' + s + '/edi_' + s + '.png';
    const td = document.createElement('td');
    a.appendChild(img);
    td.appendChild(a);
    tr.appendChild(td);
    makeTd(tr, ((line[9] || 100) * mult).toString() + '%');
    makeTd(tr, line[1] || '無限');
    makeTd(tr, line[5].toString() + '%');
    makeTd(tr, line[2] == line[10] ? line[10] : `${line[2]}~${line[10]}`);
    makeTd(tr, line[3] == line[4] ? line[3] : `${line[3]}~${line[4]}`);
    stLines.appendChild(tr);
  }
}
document.getElementById('name-search').oninput = function(event) {
  setTimeout(doSearch, 0, event.currentTarget);
}
function doSearch(t) {
  const v = t.value.split(' ').filter(x => x);
  if (!v.length) {
    search_result.style.display = 'none';
    main_div.style.display = 'block';
    return;
  }
  search_result.textContent = '';
  function f(s) {
    if (!s) return false;
    for (let i of v) {
      if (s.includes(i))
        return true;
    }
    return false;
  }
  function add(ms, is) {
    const a = document.createElement('a');
    for (let i = 0;i < is.length;++i) {
      if (is[i].name) {
        for (let j of v)
          is[i].name = is[i].name.replaceAll(j, (match) => `<span>${match}</span>`);
      }
      if (is[i].jpname) {
        for (let j of v)
          is[i].jpname = is[i].jpname.replaceAll(j, (match) => `<span>${match}</span>`);
      }
    }
    a.href = '/stage.html?s=' + ms.join('-');
    a.innerHTML = is.map(x => x.name ? (x.jpname ? `${x.name}(${x.jpname})` : x.name) : x.jpname).join(' • ');
    a.classList.add('res');
    search_result.appendChild(a);
  }
  main_div.style.display = 'none';
  search_result.style.display = 'block';
  const s1 = fs.readdirSync('/stages');
  let num_results = 0;
  for (let i = 0;i < s1.length;++i) {
    const m1 = s1[i];
    const i1 = JSON.parse(fs.readFileSync(`/stages/${m1}/info`, 'utf-8', 'r'));
    if (f(i1.name) || f(i1.jpname)) {
      add([i], [i1]);
      if (++num_results > 20) return;
    }
    const s2 = fs.readdirSync(`/stages/${m1}`);
    for (let j = 0;j < s2.length;++j) {
      const m2 = s2[j];
      if (m2 == 'info') continue;
      const i2 = JSON.parse(fs.readFileSync(`/stages/${m1}/${m2}/info`, 'utf-8', 'r'));
      if (f(i2.name) || f(i2.jpname)) {
        add([i, j], [i1, i2]);
        if (++num_results > 20) return;
      }
      const s3 = fs.readdirSync(`/stages/${m1}/${m2}`);
      for (let k = 0;k < s3.length;++k) {
        const m3 = s3[k];
        if (m3 == 'info') continue;
        const i3 = JSON.parse(fs.readFileSync(`/stages/${m1}/${m2}/${m3}`, 'utf-8', 'r'));
        if (f(i3.name) || f(i3.jpname)) {
          add([i, j, k], [i1, i2, i3]);
          if (++num_results > 20) return;
        }
      }
    }
  }
  if (!num_results)
    search_result.innerText = '沒有結果';
}
