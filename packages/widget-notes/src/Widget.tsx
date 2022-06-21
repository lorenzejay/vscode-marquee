import React, { useContext, useEffect, useMemo, useCallback } from 'react'
import { Grid, Typography, TextField, IconButton, Button } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import ClearIcon from '@mui/icons-material/Clear'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import SplitterLayout from 'react-splitter-layout'
import { List, AutoSizer } from 'react-virtualized'

import { GlobalContext, DoubleClickHelper, MarqueeWindow, jumpTo } from '@vscode-marquee/utils'
import wrapper, { Dragger, HeaderWrapper, HidePop } from '@vscode-marquee/widget'
import type { MarqueeWidgetProps } from '@vscode-marquee/widget'

import 'react-virtualized/styles.css'
import '../css/react-splitter-layout.css'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import NoteContext, { NoteProvider } from './Context'
import NoteEditor from './components/Editor'
import NoteListItem from './components/ListItem'
import { Note } from './types'

declare const window: MarqueeWindow

interface RowRendererProps {
  key: React.Key
  index: number
  style: object
}

const WidgetBody = ({ notes, note }: { notes: Note[], note: any }) => {
  const { globalScope } = useContext(GlobalContext)
  const {
    _updateNote,
    setNoteFilter,
    setNoteSplitter,
    noteFilter,
    noteSelected,
    noteSplitter,
    setNoteSelected,
    setShowEditDialog,
    setShowAddDialog
  } = useContext(NoteContext)

  const notesArr = useMemo(() => {
    let filteredItems = notes

    /**
     * only display notes that are part of the active
     * workspace
     */
    if (!globalScope) {
      filteredItems = filteredItems.filter((item) => (
        item.workspaceId && item.workspaceId === window.activeWorkspace?.id
      ))
    }

    /**
     * filter notes by note filter
     */
    if (noteFilter) {
      filteredItems = filteredItems.filter((item) => (
        item.title.toLowerCase().indexOf(noteFilter.toLowerCase()) > -1)
      )
    }

    return filteredItems
  }, [notes, globalScope, noteFilter])

  useEffect(() => {
    if (notesArr.length !== 0) {
      setNoteSelected(notesArr[0].id)
    }
  }, [noteFilter, globalScope])

  const noteItemClick = useCallback((e: any, index: number) => {
    if (e.detail === 1) {
      let noteId = notesArr[index].id
      return setNoteSelected(noteId)
    }

    if (e.detail === 2) {
      return setShowEditDialog(notesArr[index].id)
    }
  }, [notesArr])

  let rowRenderer = ({ key, index, style }: RowRendererProps) => {
    let noteEntry = notesArr[index]

    return (
      <NoteListItem
        key={key}
        keyVal={key}
        index={index}
        style={style}
        note={noteEntry}
        selected={noteSelected}
        click={noteItemClick}
      />
    )
  }
  return (
    <Grid item xs>
      <Grid
        container
        wrap="nowrap"
        direction="column"
        style={{ height: '100%' }}
      >
        <Grid item xs style={{ overflow: 'hidden' }}>
          <SplitterLayout
            percentage={true}
            primaryIndex={0}
            secondaryMinSize={10}
            primaryMinSize={10}
            secondaryInitialSize={noteSplitter || 80}
            onSecondaryPaneSizeChange={setNoteSplitter}
          >
            <div
              style={{
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Grid
                container
                wrap="nowrap"
                direction="column"
                style={{
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                <Grid item style={{ maxWidth: '100%', padding: '8px' }}>
                  <TextField
                    margin="dense"
                    placeholder="Filter..."
                    fullWidth
                    size="small"
                    value={noteFilter}
                    onChange={(e) => setNoteFilter(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <ClearIcon
                          fontSize="small"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setNoteFilter('')}
                        />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs style={{ maxWidth: '100%' }}>
                  <AutoSizer>
                    {({ height, width }: { width: number, height: number }) => (
                      <List
                        width={width}
                        height={height}
                        rowCount={notesArr.length}
                        rowHeight={30}
                        rowRenderer={rowRenderer}
                      />
                    )}
                  </AutoSizer>
                </Grid>
              </Grid>
            </div>
            <div style={{ height: '100%' }}>
              <Grid container style={{ width: '100%', height: '100%' }}>
                <Grid
                  item
                  style={{
                    height: '100%',
                    width: '100%',
                    overflow: 'auto',
                  }}
                >
                  {notesArr.length === 0 && (
                    <Grid
                      container
                      style={{ height: '100%' }}
                      alignItems="center"
                      justifyContent="center"
                      direction="column"
                    >
                      <Grid item>
                        <Typography>Nothing here yet.</Typography>
                      </Grid>
                      <Grid item>&nbsp;</Grid>
                      <Grid item>
                        <Button
                          startIcon={<AddCircleIcon />}
                          variant="outlined"
                          onClick={() => setShowAddDialog(true)}
                        >
                          Create a note
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                  {notesArr.length !== 0 && note && (
                    <NoteEditor
                      name="widget"
                      body={note.body}
                      text={note.text || ''}
                      _change={(newBody, newText) => {
                        _updateNote({
                          ...note!,
                          body: newBody,
                          text: newText,
                        })
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </div>
          </SplitterLayout>
        </Grid>
      </Grid>
    </Grid>
  )
}
let Notes = ({ ToggleFullScreen }: MarqueeWidgetProps) => {
  const {
    notes,
    noteSelected,
    setShowAddDialog
  } = useContext(NoteContext)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleToggleFullScreen = () => {
    setFullscreenMode(!fullscreenMode)
    handleClose()
  }
  const open = Boolean(anchorEl)
  const id = open ? 'todo-nav-popover' : undefined

  useEffect(() => {
    if ((ref !== null && ref.current !== null) && ref.current?.offsetWidth < 330) {
      return setMinimizeNavIcon(true)
    }
    setMinimizeNavIcon(false)
  }, [ref.current?.offsetWidth])

  const note = useMemo(() => {
    return notes.find((note) => note.id === noteSelected)
  }, [noteSelected, notes])

  const noteLinkFileName = useMemo(() => {
    if (note && note.origin) {
      return note.origin.split('/').reverse()[0].toUpperCase()
    }
  }, [note])

  const WidgetHeader = () => (
    <HeaderWrapper>
      <Grid item>
        <Grid container direction="row" spacing={1} alignItems="center">
          <Grid item>
            <Typography variant="subtitle1">Notes</Typography>
          </Grid>
          <Grid item>
            {note && noteLinkFileName && (
              <Button
                size="small"
                startIcon={<LinkIcon />}
                disableFocusRipple
                onClick={() => jumpTo(note)}
                style={{ padding: '0 5px' }}
              >
                {noteLinkFileName}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={1} alignItems="center">
          <Grid item>
            <IconButton aria-label="Add Note" size="small" onClick={() => setShowAddDialog(true)}>
              <AddCircleIcon fontSize="small" />
            </IconButton>
          </Grid>
          <Grid item>
            <DoubleClickHelper content="Double-click a note title to edit and right-click for copy & paste" />
          </Grid>
          <Grid item>
            <HidePop name="notes" />
          </Grid>
          <Grid item>
            <ToggleFullScreen />
          </Grid>
          <Grid item>
            <Dragger />
          </Grid>
        </Grid>
      </Grid>
    </HeaderWrapper>
  )

  return (
    <>
      <WidgetHeader />
      <WidgetBody note={note} notes={notes} />
    </>
  )
}

export default wrapper((props: any) => (
  <NoteProvider>
    <Notes {...props} />
  </NoteProvider>
), 'notes')
