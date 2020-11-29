import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import Navbar from './Navbar';
import Calendar from './components/Calendar';
import 'react-calendar/dist/Calendar.css';
import {Formik, Field} from 'formik';
import * as yup from 'yup';
import { ShareSolid, ClipboardCopySolid } from "@graywolfai/react-heroicons";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import agent from 'superagent-bluebird-promise'

const lynkValidationSchema = yup.object().shape({
  title: yup.string().required('A title for your link is required'),
  url: yup.string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            "That's not a valid url"
        )
        .required('Please enter a valid url'),
})
export default function App() {
  return (
    <Router>
      <div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/:name">
            <CoreApp />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
const Modal = ({setShowModal, title}) => {
  return (
      <>
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          onClick={() => setShowModal(false)}
        >
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                <h3 className="text-3xl font-semibold">
                  Here You go!
                </h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <p className="text-gray-600 text-sm leading-relaxed">
                   https://lynk.as/jon-twitter
                </p>
                <button className='bg-blue-500 content-center items-center text-center text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none '>
                  <ClipboardCopySolid className='h-6 w-6  text-center content-center items-center text-white-500' />
                </button>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">

                <button
                  className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  style={{ transition: "all .15s ease" }}
                  onClick={() => setShowModal(false)}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
  )

}
const LynkDisplay = ({lynks, setShowModal, handleDelete}) => {
  return (
    <>
    <h1> <h1 className='text-center content-center'> Your Lynks</h1></h1>
  <div style={{position:'relative', left:300}} className='flex my-6'>
    
    {lynks.map((lynk, index) => {
      return (
        <div key={index} className="max-w-smw-full mx-6 self-center items-center content-center rounded overflow-hidden shadow-lg">
        <div className='inline-flex'>
          <button onClick={() => handleDelete(lynk)} style={{ position: 'relative'}} className="bg-red-500 top-0 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
                    x
                </button>
          <button onClick={() => setShowModal(true) }  className='bg-green-500 top-0 hover:bg-green-700 text-white font-bold py-2 m-2  px-6 rounded-full'>
            <ShareSolid className='h-6 w-6 text-white-500' />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{lynk.title}</div>
          <p className="text-gray-700 text-base">
            {lynk.url}
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          
        </div>
        
      </div>
      )
    })}
  </div>
  </>
  )
}
const UrlForm = ({setShowForm, setLynks, lynks}) => (
   <div>
     <Formik
      validationSchema={lynkValidationSchema}
      initialValues={{title:'', url:''}}
       onSubmit={(values, actions) => {
         setLynks(lynks.concat(values))
         actions.resetForm({
           title: '',
           url: ''
         })
       }}
     >
       {props => (
         <div className="content-center flex justify-center">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
            <div className='mb-4'>
              <button onClick={() => setShowForm(false)} style={{left: 190, top: -10, position: 'relative'}} className="bg-blue-500 top-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                  x
              </button>
              <h2 style={{textDecoration:'none'}}> Add a link </h2>
              
              <h1 style={{color: 'red'}}> {props.errors.title} </h1>
            <input
              type="text"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.title}
              name="title"
              placeholder='Twitter'
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            </div>
            <div className='mb-4'>
              <h1 style={{color: 'red'}}> {props.errors.url} </h1> 
              <input
                type="text"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.url}
                name="url"
                placeholder='https://twitter.com/jkol36'
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              </div>
              <button 
                type="submit"
                disabled={props.isSubmitting}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                Submit
              </button>
            
          </form>
         </div>
       )}
     </Formik>
   </div>
 );

const links = [
  {
    title: "my twitter account", 
    url: 'https://twitter.com/jkol36', 
    tags: [{name:'socialmedia'}, {name:'twitter'}]
  },
  {
    title: 'My facebook account',
    url: 'https://facebook.com/jonkolman',
    tags: [{name: 'socialmedia'}, {name: 'facebook'}]
  }

  ]

function CoreApp(props) {
  console.log('showCalendar', props)
  const [calendarDate, handleCalendarChange] = useState([new Date(), new Date()]);
  const [isBooked, book] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showLinkBox, setShowLinkbox] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [lynks, setLynks] = useState([])
  const [showModal, setShowModal] = React.useState(false);
  const [activeLink, setActiveLink] = React.useState(null)


  let [name, setName] = useState('')
  name = useParams().name

  const handleDelete = lynk => {
    console.log('shoudl delete', lynk)
    setLynks(lynks.filter(l => l.title != lynk.title))
  }



  const submit = () => {
    agent.get(`https://gender-api.com/get?name=${name}&key=qZqRkHLpzeMTeNoDGh`)
    .then(res => {
      switch(res.body.gender) {
        case 'female':
          setSuccessMessage('She has been notified by email!')
          break
        case 'male': 
          setSuccessMessage('He has been notified by email!')
      }
      book(true)
    })
  }
  return (
    <div className="container mx-auto px-4">
      <Navbar user={name} setShowCalendar setShowCalendar={setShowCalendar} />
      {showCalendar ? 
        <div className='content-center flex justify-center'>

          <Calendar 
            onChange={handleCalendarChange}
            value={calendarDate}
            selectRange

          />

        </div>:null
      }
      
      {!showCalendar && !showForm ? 
      <div className='content-center flex justify-center'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setShowForm(true)}> Add a new Link </button> 
      </div>:null
      }
      {showForm && !showCalendar ? <UrlForm setShowForm={setShowForm} setLynks={setLynks} lynks={lynks} />:null}
      <LynkDisplay lynks={lynks} showModal={showModal} setShowModal={setShowModal} handleDelete={handleDelete} />
      {showModal ? <Modal setShowModal={setShowModal} />:null}
      
      
    </div>
  );
}

