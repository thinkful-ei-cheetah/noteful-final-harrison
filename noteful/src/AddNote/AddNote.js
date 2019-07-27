import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import './AddNote.css';
import NoteContext from '../NoteContext';
import PropTypes from 'prop-types'

 class AddNote extends Component {
  static defaultProps = {
    folders: [],
  }
  render() {

    const { folders } = this.props
    return (
      <NoteContext.Consumer type='notes'>
        {(prop)=>{

          return(
            <section className='AddNote'>
            <h2>Create a note</h2>
            <NotefulForm>
              <div className='field'>
                <label htmlFor='note-name-input'>
                  Name
                </label>
                <input required type='text' id='note-name-input' name='note-name-input' value={prop.noteNameInput} onChange={prop.handleFormChange}/>
              </div>
              <div className='field'>
                <label htmlFor='note-content-input'>
                  Content
                </label>
                <textarea required id='note-content-input' name='note-content-input' value={prop.noteContentInput} onChange={prop.handleFormChange}/>
              </div>
              <div className='field'>
                <label htmlFor='note-folder-select'>
                  Folder
                </label>
                <select required id='note-folder-select' name= 'note-folder-select' value={prop.noteFolderSelect} onChange={prop.handleFormChange} >
                  <option value="">...</option>
                  {folders.map(folder =>
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  )}
                </select>
              </div>
              <div className='buttons'>
                <button disabled={prop.noteNameInput=== ""}

                  type='submit'>
                  Add note
                </button>
              </div>
            </NotefulForm>
          </section>


          )

        }}
        </NoteContext.Consumer>
     
    )
  }
}

AddNote.propTypes ={
  folder: PropTypes.array.isRequired
}


export default AddNote

