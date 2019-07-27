import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import { getNotesForFolder, findNote, findFolder } from '../notes-helpers'
import './App.css'
import API from './API';
import ErrorBoundary from '../ErrorBoundaries/ErrorBoundary'

import NoteContext from '../NoteContext';


class App extends Component {
  state = {
    notes: [],
    folders: [],
    error:null,
    params:'',
    'folder-name-input': '',
    'note-name-input': '',
    'note-content-input':'',
    'note-folder-select': '',
  };

  clearData = () => {
    this.setState({
      'folder-name-input': '',
      'note-name-input': '',
      'note-content-input':'',
      'note-folder-select': '',
    })
  }


  handleFormChange = (e) => {
  
    const {name, value} = e.target;

    if(value === " " && this.state[name] ===""){
      this.setState({error: 'Cannot begin with spaces'});
      return 
    }  else {
    this.setState({
      [name]: value,
      error: '',
    })
  }

  }

  static contextType = NoteContext;

  formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
  }


  updateState = () => {

    API.apiGet()
    .then(res => {
      if(!res.ok) {
        throw new Error('Something went wrong, please try again later.');
      }
      return res;
    })
    .then(res => res.json())
    .then(data => { 

      this.setState({
        notes:data.notes,
        folders: data.folders,
        error: null
      });
    })
    .catch(err => {
      this.setState({
        error: err.message
      });
    });

  }

  componentDidMount() {
    // API.apiPost({name:'test2', type:'folders'});
    this.updateState();
  }
  
  
  
  noteDelete = (noteId) => {
      
          API.apiDelete(noteId);

          const newNotes = this.state.notes.filter(note => noteId !== note.id);
          this.setState({
            notes:newNotes,
          })
          
  
      }
  
  
  renderNavRoutes() {
    const { notes, folders } = this.state
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          <Route
            exact
            key={path}
            path={path}
            render={routeProps =>
              <NoteListNav
                folders={folders}
                notes={notes}
                {...routeProps}
              />
            }
          />
        )}
        <Route
          path='/note/:noteId'
          render={routeProps => {
            const { noteId } = routeProps.match.params
            const note = findNote(notes, noteId) || {}
            const folder = findFolder(folders, note.folderId)
            return (
              <NotePageNav
                {...routeProps}
                folder={folder}
              />
            )
          }}
        />
        <Route
          path='/add-folder'
          component={NotePageNav}
        />
        <Route
          path='/add-note'
          component={NotePageNav}
        />
      </>
    )
  }

  renderMainRoutes() {
    const { notes, folders } = this.state
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          <Route
            exact
            key={path}
            path={path}
            render={routeProps => {
              const { folderId } = routeProps.match.params
              const notesForFolder = getNotesForFolder(notes, folderId)
              return (
                <NoteListMain
                  {...routeProps}
                  notes={notesForFolder}
                />
              )
            }}
          />
        )}
        <Route
          path='/note/:noteId'
          render={routeProps => {
            const { noteId } = routeProps.match.params
            const note = findNote(notes, noteId)
            return (
              <NotePageMain
                {...routeProps}
                note={note}
              />
            )
          }}
        />
        <Route
          path='/add-folder'
          component={AddFolder}
        />
        <Route
          path='/add-note'
          render={routeProps => {
            return (
              <AddNote
                {...routeProps}
                folders={folders}
              />
            )
          }}
        />
      </>
    )
  }

render() {

    const contextValue = {
      folderName: this.state['folder-name-input'],
      noteNameInput: this.state['note-name-input'],
      noteContentInput:this.state['note-content-input'],
      noteFolderSelect: this.state['note-folder-select'],
      deleteNote : this.noteDelete,
      handleFormChange: this.handleFormChange,
      error: this.state.error,
      updateState:this.updateState,
      clearData: this.clearData,
    }

    return (
      <ErrorBoundary>
      <NoteContext.Provider 
        value={contextValue}>
        <div className='App'>
          <nav className='App__nav'>
            {this.renderNavRoutes()}
          </nav>
          <header className='App__header'>
            <h1>
              <Link to='/'>Noteful</Link>
              {' '}
              <FontAwesomeIcon icon='check-double' />
            </h1>
          </header>
          <main className='App__main'>
            {this.renderMainRoutes()}
          </main>
        </div>
      </NoteContext.Provider>
      </ErrorBoundary>
    )
  }
}

export default App
