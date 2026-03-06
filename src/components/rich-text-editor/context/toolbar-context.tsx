"use client"

import { createContext, JSX, useContext } from "react"
import { LexicalEditor } from "lexical"

const Context = createContext<{
  activeEditor: LexicalEditor
  $updateToolbar: () => void
  blockType: string
  setBlockType: (blockType: string) => void
  showModal: (
    title: string,
    showModal: (onClose: () => void) => JSX.Element
  ) => void
  onSave?: () => void
  isDirty: boolean
}>({
  activeEditor: {} as LexicalEditor,
  $updateToolbar: () => {},
  blockType: "paragraph",
  setBlockType: () => {},
  showModal: () => {},
  onSave: undefined,
  isDirty: false,
})

export function ToolbarContext({
  activeEditor,
  $updateToolbar,
  blockType,
  setBlockType,
  showModal,
  onSave,
  isDirty = false,
  children,
}: {
  activeEditor: LexicalEditor
  $updateToolbar: () => void
  blockType: string
  setBlockType: (blockType: string) => void
  showModal: (
    title: string,
    showModal: (onClose: () => void) => JSX.Element
  ) => void
  onSave?: () => void
  isDirty?: boolean
  children: React.ReactNode
}) {
  return (
    <Context.Provider
      value={{
        activeEditor,
        $updateToolbar,
        blockType,
        setBlockType,
        showModal,
        onSave,
        isDirty,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useToolbarContext() {
  return useContext(Context)
}
