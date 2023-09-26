import React, { Component } from "react";
import Header from "./Header.js";
import NotesList from "./NotesList.js";

/* This container component manages all of the state 
for this application, delegating rendering logic to 
presentational components. */
class App extends Component {
  state = {
    notes: [
      {
        id: 0,
        title: "eat",
        description: "reese peanut butter cups",
        doesMatchSearch: true
      },
      {
        id: 1,
        title: "sleep",
        description: "eight hours",
        doesMatchSearch: true
      },
      {
        id: 2,
        title: "code",
        description: "build an awesome ui",
        doesMatchSearch: true
      }
    ],
    searchText: "search"
  };

  addNote = () => {
    //create new note
    const newNote = {
      id: Date.now(),
      title: "",
      description: "",
      doesMatchSearch: true
    };

    // add new note to existing array
    this.setState({ notes: [newNote, ...this.state.notes] });
  };

  onType = (editMeId, updatedKey, updatedValue) => {
    //editMeId == id of note being edited
    //updatedKey == tital or desc field
    //updatedValue == value of tital or desc

    const updatedNotes = this.state.notes.map((note) => {
      //if note is does not match changed note, return note
      if (note.id !== editMeId) {
        return note;
      } else {
        // is the updated information the title or desc?
        if (updatedKey === "title") {
          note.title = updatedValue;
          return note;
        } else {
          note.description = updatedValue;
          return note;
        }
      }
    });
    this.setState({ notes: updatedNotes });
  };

  onSearch = (text) => {
    const newSearchText = text.toLowerCase();
    const updatedNotes = this.state.notes.map((note) => {
      //if updated note is deleted, all notes will show
      if (!newSearchText) {
        note.doesMatchSearch = true;
        return note;
      } else {
        //variables for to grab lowercase title and description and compare if they match updated info
        const title = note.title.toLowerCase();
        const description = note.description.toLowerCase();
        const titleMatch = title.includes(newSearchText);
        const descriptionMatch = description.includes(newSearchText);
        //if the title and the new search text are the same, then they match
        //if the description and new search text are the same, then they match
        const hasMatch = titleMatch || descriptionMatch;
        note.doesMatchSearch = hasMatch;
        return note;
        //if not matches, return all notes
      }
    });
    this.setState({
      notes: updatedNotes,
      searchText: newSearchText
    });
  };

  //filtering through notes, returning notes array as long as it does not match the search
  removeNote = (noteId) => {
    const notIdMatch = (note) => note.id !== noteId;
    const updatedNotes = this.state.notes.filter(notIdMatch);
    this.setState({ notes: updatedNotes });
  };
  //Saves changes made to notes and turns data into string
  componentDidUpdate() {
    const stringifiedNotes = JSON.stringify(this.state.notes);
    localStorage.setItem("savedNotes", stringifiedNotes);
  }

  //When app is opened, this funtion will load what has been saved
  componentDidMount() {
    const stringifiedNotes = localStorage.getItem("savedNotes");
    if (stringifiedNotes) {
      const savedNotes = JSON.parse(stringifiedNotes);
      this.setState({ notes: savedNotes });
    }
  }

  render() {
    return (
      <div>
        <Header
          onSearch={this.onSearch}
          addNote={this.addNote}
          searchText={this.state.searchText}
        />
        <NotesList
          removeNote={this.removeNote}
          onType={this.onType}
          notes={this.state.notes}
        />
      </div>
    );
  }
}

export default App;
