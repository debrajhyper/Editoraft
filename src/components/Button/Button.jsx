import './button.css';
import { setEditorData } from "../../utils/LocalStorage";

export function Button({ editorData }) {

    function handleEditorDataSave() {
        const response = setEditorData(editorData.getCurrentContent());
        if (response) alert('Data saved!!');
    }

    return <button onClick={handleEditorDataSave}>Save</button>
}
