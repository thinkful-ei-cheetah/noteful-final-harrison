import React from 'react'

const NoteContext = React.createContext({
    state: {},
    deleteNote: () => {},
})

export default NoteContext;