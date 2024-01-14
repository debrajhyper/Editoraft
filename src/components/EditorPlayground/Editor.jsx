import { useRef, useEffect } from "react";
import { BOLD, CODE_BLOCK, DOUBLE_STAR_KEY, EDITOR_HANDLED, EDITOR_NOT_HANDLED, EMPTY_STRING, ENTER_KEY, HASH_KEY, HEADER_ONE, INSERT_CHAR, RED_TEXT, REMOVE_RANGE, SPLIT_BLOCK, STAR_KEY, THIRTY_TWO, TRIPLE_STAR_KEY, UNDERLINE } from "../../constant/Constant";
import './editor-playground.css'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, Modifier } from 'draft-js';

const myStyle = {
    redUnderline: {
        textDecoration: 'underline',
        color: 'red',
    },
    redText: {
        color: 'red',
    },
    codeBlock: {
        backgroundColor: '#f3f3f3',
        padding: '10px',
        borderRadius: '5px',
    },
};

export function MyEditor({ editorData, setEditorData }) {
    const editorRef = useRef(null);

    function handleEditorStateChange(newEditorData) {
        setEditorData(newEditorData);
    }

    function keyBindingFn(e) {
        if (e.keyCode === THIRTY_TWO && e.shiftKey && e.altKey) {
            return CODE_BLOCK;
        }
        return getDefaultKeyBinding(e);
    }

    function handleReturn(e) {
        if (e.key === ENTER_KEY) {
            e.preventDefault();

            const content = editorData.getCurrentContent();
            const selection = editorData.getSelection();
            const currentBlock = content.getBlockForKey(selection.getStartKey());

            if (!currentBlock.getText().trim()) {
                const newContent = Modifier.insertText(content, selection, '\n');
                const newState = EditorState.push(editorData, newContent, INSERT_CHAR);
                setEditorData(EditorState.forceSelection(newState, newContent.getSelectionAfter()));
            } else {
                const newContent = Modifier.splitBlock(content, selection);
                const newState = EditorState.push(editorData, newContent, SPLIT_BLOCK);
                setEditorData(EditorState.forceSelection(newState, newContent.getSelectionAfter()));
            }

            return EDITOR_HANDLED;
        }
        return EDITOR_NOT_HANDLED;
    }

    function handleKeyCommand(command, state) {
        const newEditorData = RichUtils.handleKeyCommand(state, command);

        if (newEditorData) {
            setEditorData(newEditorData);
            return EDITOR_HANDLED;
        }
        return EDITOR_NOT_HANDLED;
    }


    function handleBeforeInput(char) {
        const selection = editorData.getSelection();
        const content = editorData.getCurrentContent();
        const block = content.getBlockForKey(selection.getStartKey());
        const blockText = block.getText();


        if (char === HASH_KEY) {
            handleEditorStateChange(
                EditorState.push(
                    editorData,
                    Modifier.insertText(content, selection, HASH_KEY, null, null),
                    INSERT_CHAR
                )
            );
            return EDITOR_HANDLED;
        }

        if (char === EMPTY_STRING) {
            const trimmedText = blockText.trim();
            const blockWithoutSpace = blockText.replace(/\s/g, ''); // Remove all spaces
            if (trimmedText === HASH_KEY && blockWithoutSpace === HASH_KEY) {
                const newBlockText = trimmedText.substring(1); // Remove '#'
                const newContent = Modifier.replaceText(content, selection.merge({ anchorOffset: 0 }), newBlockText);
                const newEditorData = EditorState.push(editorData, newContent, REMOVE_RANGE);
                handleEditorStateChange(RichUtils.toggleBlockType(newEditorData, HEADER_ONE));
                return EDITOR_HANDLED;
            }

            if (trimmedText === STAR_KEY && blockWithoutSpace === STAR_KEY) {
                const newBlockText = trimmedText.substring(1); // Remove '*'
                const newContent = Modifier.replaceText(content, selection.merge({ anchorOffset: 0 }), newBlockText);
                const newEditorData = EditorState.push(editorData, newContent, REMOVE_RANGE);
                handleEditorStateChange(RichUtils.toggleInlineStyle(newEditorData, BOLD));
                return EDITOR_HANDLED;
            }
            if (trimmedText === DOUBLE_STAR_KEY && blockWithoutSpace === DOUBLE_STAR_KEY) {
                const newBlockText = trimmedText.substring(2); // Remove '**'
                const newContent = Modifier.replaceText(content, selection.merge({ anchorOffset: 0 }), newBlockText);
                const newEditorData = EditorState.push(editorData, newContent, REMOVE_RANGE);
                handleEditorStateChange(RichUtils.toggleInlineStyle(newEditorData, RED_TEXT));
                return EDITOR_HANDLED;
            }
            if (trimmedText === TRIPLE_STAR_KEY && blockWithoutSpace === TRIPLE_STAR_KEY) {
                const newBlockText = trimmedText.substring(3); // Remove '***'
                const newContent = Modifier.replaceText(content, selection.merge({ anchorOffset: 0 }), newBlockText);
                const newEditorData = EditorState.push(editorData, newContent, REMOVE_RANGE);
                const newState = RichUtils.toggleInlineStyle(newEditorData, UNDERLINE);
                handleEditorStateChange(newState);
                return EDITOR_HANDLED;
            }
        }
        return EDITOR_NOT_HANDLED;
    }

    function focusEditor() {
        return editorRef?.current?.focus();
    }

    // useEffect(() => {
    //     focusEditor();
    // }, []);

    return (
        <div className="editor-playground">
            <Editor
                ref={editorRef}
                editorState={editorData}
                onChange={handleEditorStateChange}
                customStyleMap={myStyle}
                keyBindingFn={keyBindingFn}
                handleReturn={handleReturn}
                handleKeyCommand={handleKeyCommand}
                handleBeforeInput={handleBeforeInput}
            />
        </div>
    );
}