import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownToLine, ArrowLeft, ArrowRight, Bell, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, CodeXml, Database, GraduationCap, LayoutDashboard, Menu, Moon, PanelTop, Search, Sun, Target, X } from 'lucide-react'
import './style.css'
import Login from './Login'

const courses = [
  {id:'web', title:'Web Design & Development', code:'WDD 101', icon:CodeXml, color:'violet', initial:5, lessons:[
    ['How the web works','Browsers request resources over HTTP and render the HTML, CSS and JavaScript sent by the server.'],
    ['Semantic HTML','Use elements such as main, nav and article to describe the purpose of each part of a page.'],
    ['CSS selectors','Selectors match elements so you can apply rules to a type, class or state.'],
    ['Flexbox','Flexbox aligns items along one main axis. Try justify-content and align-items on a row of cards.'],
    ['Responsive layouts','Start with a narrow layout and add media queries where the content needs more space.'],
    ['CSS Grid & Layout','Grid organizes content in rows and columns. Try grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) to create a responsive card layout.'],
    ['JavaScript events','Use addEventListener to respond to clicks and keyboard input.'],
    ['Accessible forms','Associate labels with inputs and provide readable validation messages.']
  ]},
  {id:'data', title:'Database Management', code:'DBM 102', icon:Database, color:'blue', initial:3, lessons:[
    ['Relational databases','Tables organize related records into rows and columns.'],
    ['Primary keys','A primary key uniquely identifies a record in a table.'],
    ['Foreign keys','A foreign key refers to a key in another table.'],
    ['SQL joins','An INNER JOIN returns rows with matching values on both sides.'],
    ['Normalization','Organize data to reduce repeated facts and avoid update anomalies.'],
    ['Indexes','Indexes can speed up reads and introduce additional work on writes.']
  ]},
  {id:'ux', title:'UI/UX Design', code:'UXD 103', icon:PanelTop, color:'peach', initial:2, lessons:[
    ['User interviews','Ask open-ended questions about actual tasks and recent experiences.'],
    ['User journeys','Map the steps a person takes to reach a goal and note where they struggle.'],
    ['Wireframes','Sketch structure and navigation before refining visual details.'],
    ['Prototyping','Connect screens to test a complete task flow.'],
    ['Usability testing','Give users a realistic task and observe how they work through it.']
  ]}
]
const assignments = [
  {id:'layout', title:'Responsive Layout', course:'Web Design & Development', day:14, instruction:'Build a responsive three-card layout that adapts to mobile and desktop screens. Include a short explanation of your layout choices.'},
  {id:'sql', title:'SQL Practice Sheet', course:'Database Management', day:17, instruction:'Write an INNER JOIN and a LEFT JOIN for a sample course enrollment database. Explain the difference in the returned rows.'},
  {id:'wire', title:'Dashboard Wireframes', course:'UI/UX Design', day:20, instruction:'Create low-fidelity desktop and mobile dashboard wireframes. Identify the main action on each screen.'}
]
const tasks = ['Review course notes','Finish the CSS Grid lesson','Start the SQL practice sheet']
const nav = [
  {id:'dashboard', label:'Dashboard', icon:LayoutDashboard},
  {id:'courses', label:'My Courses', icon:BookOpen},
  {id:'assignments', label:'Assignments', icon:ClipboardList},
  {id:'calendar', label:'Calendar', icon:CalendarDays},
  {id:'grades', label:'Grades', icon:GraduationCap},
  {id:'resources', label:'Resources', icon:ArrowDownToLine}
]
function useSaved<T,>(key:string, initial:T) {
  const [value,setValue] = useState<T>(() => {
    try { const item = localStorage.getItem(key); return item ? JSON.parse(item) as T : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key,JSON.stringify(value)) } catch { /* Storage can be disabled. */ } },[key,value])
  return [value,setValue] as const
}
function App({ onLogout }: { onLogout: () => void }){
  const mainRef = useRef<HTMLElement>(null)
  const [theme,setTheme]=useSaved('ls-theme','light')
  const [done,setDone]=useSaved('ls-lessons',Object.fromEntries(courses.map(c=>[c.id,Array.from({length:c.initial},(_,i)=>i)])))
  const [checked,setChecked]=useSaved('ls-tasks',[true,false,false])
  const [completed,setCompleted]=useSaved<string[]>('ls-assignments',[])
  const [read,setRead]=useSaved('ls-notification',false)
  const [page,setPage]=useState('dashboard')
  const [courseId,setCourseId]=useState('web')
  const [lesson,setLesson]=useState(0)
  const [query,setQuery]=useState('')
  const [searchOpen,setSearchOpen]=useState(false)
  const [notice,setNotice]=useState(false)
  const [menu,setMenu]=useState(false)
  const [selected,setSelected]=useState<string|null>(null)
  const [day,setDay]=useState<number|null>(null)
  const [month,setMonth]=useState(new Date(2026,10,1))
  const course=courses.find(c=>c.id===courseId)!
  const totalDone=Object.values(done).reduce((sum,items)=>sum+items.length,0)
  const activeAssignment=assignments.find(a=>a.id===selected)
  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme])
  useEffect(()=>{
    function escape(e:KeyboardEvent){if(e.key==='Escape'){setSelected(null);setSearchOpen(false);setNotice(false);setMenu(false)}}
    window.addEventListener('keydown',escape)
    return ()=>window.removeEventListener('keydown',escape)
  },[])
  function go(id:string){mainRef.current?.scrollTo(0,0);setPage(id);setMenu(false);setSearchOpen(false);setNotice(false);window.scrollTo(0,0)}
  function openCourse(id:string){
    const item=courses.find(c=>c.id===id)!
    const next=item.lessons.findIndex((_,i)=>!done[id].includes(i))
    setCourseId(id);setLesson(next<0?0:next);go('lesson')
  }
  function completeLesson(){
    setDone(old=>({...old,[course.id]:[...new Set([...old[course.id],lesson])]}))
  }
  const results=[...courses.map(c=>({title:c.title,kind:'Course',act:()=>openCourse(c.id)})),...assignments.map(a=>({title:a.title,kind:'Assignment',act:()=>setSelected(a.id)}))].filter(item=>item.title.toLowerCase().includes(query.trim().toLowerCase()))
  const progress=(id:string)=>{const c=courses.find(x=>x.id===id)!;return Math.round(done[id].length/c.lessons.length*100)}
  function courseCards(){
    return <div className="course-grid">{courses.map(c=><button className="card course" key={c.id} onClick={()=>openCourse(c.id)}>
      <div className={'course-art '+c.color}><c.icon size={41} strokeWidth={1.55}/><span className="art-ring"/><span className="art-ring second"/></div>
      <div className="course-copy"><small>{c.code}</small><h3>{c.title}</h3><div className="progress" role="progressbar" aria-label={c.title} aria-valuenow={progress(c.id)}><span style={{width:progress(c.id)+'%'}}/></div><div className="course-meta"><span>{done[c.id].length}/{c.lessons.length} lessons</span><strong>{progress(c.id)}%</strong></div></div>
    </button>)}</div>
  }
  function assignmentRows(items=assignments){
    return items.length ? items.map(a=><button className="assignment-row" key={a.id} onClick={()=>setSelected(a.id)}>
      <span className="date-chip"><small>NOV</small><b>{a.day}</b></span><span><b>{a.title}</b><small>{a.course}</small></span><span className="row-end">{completed.includes(a.id)?<Check size={16}/>:<ChevronRight size={16}/>}</span>
    </button>) : <p className="muted">No assignments for this date.</p>
  }
  function calendar(){
    const yr=month.getFullYear(), m=month.getMonth()
    const offset=(new Date(yr,m,1).getDay()+6)%7
    const count=new Date(yr,m+1,0).getDate()
    return <div className="card rail-card"><h2>Study calendar</h2><div className="month"><b>{month.toLocaleDateString('en',{month:'long',year:'numeric'})}</b><div>
      <button className="icon-btn" aria-label="Previous month" onClick={()=>{setMonth(new Date(yr,m-1,1));setDay(null)}}><ChevronLeft size={16}/></button>
      <button className="icon-btn" aria-label="Next month" onClick={()=>{setMonth(new Date(yr,m+1,1));setDay(null)}}><ChevronRight size={16}/></button>
    </div></div><div className="calendar-grid">{['M','T','W','T','F','S','S'].map((d,i)=><small key={i}>{d}</small>)}{Array.from({length:offset},(_,i)=><span key={'b'+i}/>)}{Array.from({length:count},(_,i)=>{
      const d=i+1, marked=yr===2026&&m===10&&assignments.some(a=>a.day===d)
      return <button key={d} className={(day===d?'chosen ':'')+(marked?'marked':'')} aria-pressed={day===d} aria-label={`${month.toLocaleDateString('en',{month:'long'})} ${d}${marked?', assignment due':''}`} onClick={()=>setDay(day===d?null:d)}>{d}</button>
    })}</div></div>
  }
  return <>
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu}><Menu size={22}/></button>
      <button className="brand" onClick={()=>go('dashboard')}><span><GraduationCap size={24}/></span>LearnSpace</button>
      <div className="search" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setSearchOpen(false)}}>
        <Search size={18}/><input placeholder="Search courses and assignments..." value={query} onChange={e=>{setQuery(e.target.value);setSearchOpen(true)}} onFocus={()=>setSearchOpen(true)} aria-label="Search courses and assignments"/>
        {searchOpen&&query.trim()&&<div className="popover">{results.length?results.map(r=><button key={r.title} onClick={()=>{r.act();setSearchOpen(false);setQuery('')}}>{r.title}<small>{r.kind}</small></button>):<p>No matching results.</p>}</div>}
      </div>
      <div className="header-tools">
        <button className="icon-btn header-button" aria-label={theme==='dark'?'Switch to light mode':'Switch to dark mode'} onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?<Sun size={19}/>:<Moon size={19}/>}</button>
        <div className="notice-wrap"><button className="icon-btn header-button" aria-label="Notifications" aria-expanded={notice} onClick={()=>{setNotice(!notice);setRead(true)}}><Bell size={19}/>{!read&&<i/>}</button>{notice&&<div className="popover notice"><b>Notifications</b><button onClick={()=>{setSelected('layout');setNotice(false)}}>Responsive Layout is due Nov 14.<small>Assignment reminder</small></button></div>}</div>
        <div className="profile"><span>AM</span><div><b>Alex Morgan</b><small>Student</small></div></div>
      </div>
    </header>
    <div className="shell">
      {menu&&<button className="backdrop" aria-label="Close navigation" onClick={()=>setMenu(false)}/>}
      <aside className={'sidebar '+(menu?'open':'')}><div className="side-main">
        <div className="sidebar-profile" aria-label="Student profile">
          <span className="sidebar-avatar" aria-hidden="true">AM</span>
          <div className="sidebar-identity"><b>Alex Morgan</b><small>Student</small></div>
        </div>
        <p className="nav-label">WORKSPACE</p><nav aria-label="Workspace">{nav.map(n=><button key={n.id} className={(page===n.id||(page==='lesson'&&n.id==='courses'))?'active':''} onClick={()=>go(n.id)}><n.icon size={19}/>{n.label}</button>)}</nav></div><div className="side-bottom"><button className="help" onClick={onLogout}>Log out</button><button className="help" onClick={()=>go('help')}><CircleHelp size={18}/> Help & Support</button><p>LearnSpace · Demo workspace</p></div></aside>
      <main id="main" ref={mainRef} tabIndex={0} aria-label="Learning dashboard">
        <div className="page-title"><div><p className="eyebrow">STUDENT WORKSPACE</p><h1>{page==='lesson'?course.title:nav.find(n=>n.id===page)?.label??'Help & Support'}</h1></div>{page==='dashboard'&&<span className="demo-label">Demo data</span>}</div>
        {page==='dashboard'&&<>
          <section className="hero"><div className="hero-copy"><p>YOUR LEARNING SPACE</p><h2>Welcome back, Alex.</h2><div>Pick up where you left off and stay on top of your coursework.</div><button onClick={()=>openCourse('web')}>Continue learning <ArrowRight size={17}/></button></div>
          <div className="hero-art" aria-hidden="true"><div className="orbit"/><div className="spark one">✦</div><div className="spark two">✧</div><div className="floating icon-float"><CodeXml size={24}/></div><div className="floating book-float"><BookOpen size={22}/></div><div className="hero-window"><div className="window-top"><i/><i/><i/></div><div className="window-body"><div className="window-symbol"><GraduationCap size={39}/></div><div className="window-lines"><i/><i/><i/></div></div><div className="window-progress"><i/></div></div><div className="floating check-float"><Check size={21}/></div></div>
          </section>
          <section><div className="section-head"><h2>Learning overview</h2></div><div className="stats">
            {[{label:'Enrolled courses',value:courses.length,icon:BookOpen,color:'violet'},{label:'Lessons completed',value:totalDone,icon:Target,color:'blue'},{label:'Assignments due',value:assignments.length-completed.length,icon:ClipboardList,color:'peach'}].map(s=><div className="card stat" key={s.label}><span className={'stat-icon '+s.color}><s.icon size={20}/></span><div><small>{s.label}</small><strong>{s.value}</strong></div></div>)}
          </div></section>
          <section><div className="section-head"><h2>My courses</h2><button className="text-btn" onClick={()=>go('courses')}>View all <ArrowRight size={16}/></button></div>{courseCards()}</section>
          <section><div className="section-head"><h2>Quick actions</h2></div><div className="quick">{nav.slice(2).map(n=><button className="card" key={n.id} onClick={()=>go(n.id)}><n.icon size={20}/>{n.label}</button>)}</div></section>
        </>}
        {page==='courses'&&courseCards()}
        {page==='lesson'&&<section className="card content-card">
          <button className="text-btn" onClick={()=>go('courses')}><ArrowLeft size={16}/> My courses</button>
          <div className="lesson-grid"><div><p className="eyebrow">{course.code} · LESSON {lesson+1} OF {course.lessons.length}</p><h2>{course.lessons[lesson][0]}</h2><p>{course.lessons[lesson][1]}</p><div className="lesson-actions"><button className="primary" disabled={done[course.id].includes(lesson)} onClick={completeLesson}>{done[course.id].includes(lesson)?'Completed':'Mark complete'}</button>{lesson<course.lessons.length-1&&<button className="text-btn" onClick={()=>setLesson(lesson+1)}>Next lesson <ArrowRight size={16}/></button>}</div></div><nav aria-label="Course lessons">{course.lessons.map(([title],i)=><button key={title} className={lesson===i?'active':''} onClick={()=>setLesson(i)}>{done[course.id].includes(i)?<Check size={16}/>:<BookOpen size={16}/>} {title}</button>)}</nav></div>
        </section>}
        {page==='assignments'&&<section className="card content-card">{assignmentRows()}</section>}
        {page==='calendar'&&<div className="calendar-page">{calendar()}<div className="card rail-card"><h2>{day?month.toLocaleDateString('en',{month:'long'})+' '+day:'This month'}</h2>{assignmentRows(month.getFullYear()===2026&&month.getMonth()===10?assignments.filter(a=>!day||a.day===day):[])}</div></div>}
        {page==='grades'&&<section className="card content-card"><h2>Sample grades</h2><table><thead><tr><th scope="col">Course</th><th scope="col">Assessment</th><th scope="col">Score</th></tr></thead><tbody>{courses.map((c,i)=><tr key={c.id}><td>{c.title}</td><td>Module 1 quiz</td><td>{[86,79,92][i]}%</td></tr>)}</tbody></table></section>}
        {page==='resources'&&<section className="card content-card"><h2>Course study notes</h2>{courses.map(c=><a className="resource" key={c.id} download={c.code+'.txt'} href={'data:text/plain;charset=utf-8,'+encodeURIComponent(c.title+'\n\n'+c.lessons.map(([title,body])=>title+'\n'+body).join('\n\n'))}><ArrowDownToLine size={18}/>{c.title} study notes</a>)}</section>}
        {page==='help'&&<section className="card content-card"><h2>Using LearnSpace</h2><p>Open a course to read its lessons and mark them complete. Select an assignment to view the brief and update your study status.</p><p>Progress, checklist items and theme are saved in this browser. The dashboard uses sample courses and grades.</p></section>}
        <footer>© 2026 LearnSpace</footer>
      </main>
      <aside className="rail" tabIndex={0} aria-label="Study planner">
        <div className="rail-title"><h2>Study planner</h2><CalendarDays size={19}/></div>
        <div className="card rail-card"><div className="rail-head"><h2>Upcoming deadlines</h2><button className="icon-btn" aria-label="View all assignments" onClick={()=>go('assignments')}><ArrowRight size={17}/></button></div>{assignmentRows(assignments.filter(a=>!completed.includes(a.id)))}</div>
        {page!=='calendar'&&calendar()}
        <div className="card rail-card"><div className="rail-head"><h2>Study checklist</h2><small>{checked.filter(Boolean).length}/{tasks.length}</small></div>{tasks.map((t,i)=><label key={t} className={'task '+(checked[i]?'checked':'')}><input type="checkbox" checked={checked[i]} onChange={()=>setChecked(old=>old.map((v,j)=>j===i?!v:v))}/>{t}</label>)}</div>
      </aside>
    </div>
    {activeAssignment&&<dialog open className="dialog" aria-label={activeAssignment.title}><button autoFocus className="icon-btn close" aria-label="Close assignment" onClick={()=>setSelected(null)}><X size={22}/></button><p className="eyebrow">{activeAssignment.course}</p><h2>{activeAssignment.title}</h2><p className="muted">Due November {activeAssignment.day}, 2026</p><p>{activeAssignment.instruction}</p><button className="primary" onClick={()=>setCompleted(old=>old.includes(activeAssignment.id)?old.filter(x=>x!==activeAssignment.id):[...old,activeAssignment.id])}>{completed.includes(activeAssignment.id)?'Mark as pending':'Mark as complete'}</button></dialog>}
    {activeAssignment&&<button className="modal-backdrop" aria-label="Dismiss assignment" onClick={()=>setSelected(null)}/>}
  </>
}
function LearnSpace() {
  const [signedIn, setSignedIn] = useState(false)
  const [theme, setTheme] = useSaved('ls-theme', 'light')
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  if (signedIn) return <App onLogout={() => {
    try { setTheme(JSON.parse(localStorage.getItem('ls-theme') || '"light"')) } catch { setTheme('light') }
    setSignedIn(false)
  }}/>
  return <Login onLogin={() => setSignedIn(true)} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}/>
}
createRoot(document.getElementById('root')!).render(<LearnSpace/>)
