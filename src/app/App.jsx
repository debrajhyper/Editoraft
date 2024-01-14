import { useState, useEffect } from "react";
import "./App.css";
import { getEditorData } from "../utils/LocalStorage";
import { Title, Button, MyEditor } from '../components';
import { EditorState} from 'draft-js';


function App() {
  const [editorData, setEditorData] = useState(EditorState.createEmpty());

  useEffect(() => {
    const [status, editorData] = getEditorData();
    if (status) {
      setEditorData(EditorState.createWithContent(editorData));
    }
  }, []);

  return (
    <div className="App">
      <header className="header">
        <Title />
        <Button editorData={editorData} />
      </header>
      <main className="main">
        <MyEditor editorData={editorData} setEditorData={setEditorData} />
      </main>
    </div>
  );
}

export default App;
