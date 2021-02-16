import React from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-handlebars'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-xcode'

const textEditor = props => {
  if (typeof window !== 'undefined') {
    return (
      <div>
        <AceEditor
          mode={props.mode}
          theme={props.theme}
          name={props.name}
          editorProps={{
            $blockScrolling: true
          }}
          value={props.value}
          fontSize={props.fontSize}
          height={props.height}
          width={props.width}
          readOnly={props.readOnly}
          onChange={props.onChange}
        />
      </div>
    )
  }

  return null
}

export default textEditor
