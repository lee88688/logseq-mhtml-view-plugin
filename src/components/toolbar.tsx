import React from 'react'
import clsx from 'clsx'
import { useViewerStore } from '../store/viewer'

const HighlightMode = () => (
  <svg
    stroke="currentColor"
    viewBox="0 0 24 24"
    fill="none"
    width="16"
    height="16"
  >
    <path
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    ></path>
  </svg>
)

const ZoomIn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
    ></path>
  </svg>
)

const ZoomOut = () => (
  <svg
    fill="none"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
    ></path>
  </svg>
)

const Outline = () => (
  <svg
    viewBox="0 0 1024 1024"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
  >
    <path
      d="M134.976 853.312H89.6c-26.56 0-46.912-20.928-46.912-48.256 0-27.392 20.352-48.32 46.912-48.32h45.376c26.624 0 46.912 20.928 46.912 48.32 0 27.328-20.288 48.256-46.912 48.256zM134.976 560.32H89.6C63.04 560.32 42.688 539.392 42.688 512s20.352-48.32 46.912-48.32h45.376c26.624 0 46.912 20.928 46.912 48.32s-20.288 48.32-46.912 48.32zM134.976 267.264H89.6c-26.56 0-46.912-20.928-46.912-48.32 0-27.328 20.352-48.256 46.912-48.256h45.376c26.624 0 46.912 20.928 46.912 48.256 0 27.392-20.288 48.32-46.912 48.32zM311.744 853.312c-26.56 0-46.912-20.928-46.912-48.256 0-27.392 20.352-48.32 46.912-48.32h622.72c26.56 0 46.848 20.928 46.848 48.32 0 27.328-20.288 48.256-46.912 48.256H311.744c1.6 0 1.6 0 0 0zM311.744 560.32c-26.56 0-46.912-20.928-46.912-48.32s20.352-48.32 46.912-48.32h622.72c26.56 0 46.848 20.928 46.848 48.32s-20.288 48.32-46.912 48.32H311.744c1.6 0 1.6 0 0 0zM311.744 267.264c-26.56 0-46.912-20.928-46.912-48.32 0-27.328 20.352-48.256 46.912-48.256h622.72c26.56 0 46.848 20.928 46.848 48.256 0 27.392-20.288 48.32-46.912 48.32H311.744c1.6 0 1.6 0 0 0z"
      fill="currentColor"
    ></path>
  </svg>
)

const Search = () => (
  <svg viewBox="0 0 20 20" width="19" height="19" fill="currentColor">
    <path
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
      fillRule="evenodd"
    ></path>
  </svg>
)

const AnnotationPage = () => (
  <svg viewBox="0 0 1024 1024" width="16" height="16">
    <path
      d="M866.368 64 157.632 64C105.984 64 64 105.984 64 157.632l0 522.112c0 51.648 41.984 93.632 93.632 93.632l111.744 0 132.736 174.08C408.192 955.392 417.536 960 427.584 960s19.392-4.608 25.408-12.544l132.736-174.08 280.64 0c51.648 0 93.632-41.984 93.632-93.632L960 157.632C960 105.984 918.016 64 866.368 64zM429.504 234.624 318.72 599.808C313.408 617.536 295.36 627.52 278.528 622.4 261.632 617.344 252.16 598.848 257.472 581.376l110.72-365.312c5.312-17.472 23.36-27.584 40.32-22.464C425.408 198.72 434.816 217.216 429.504 234.624zM827.2 391.04c-3.2 5.504-6.656 9.088-10.176 10.624-33.152 12.992-69.632 22.592-109.376 28.48 7.232 6.592 16.064 15.488 26.624 26.496 10.496 11.136 16.064 17.024 16.512 17.728 3.904 5.376 9.28 12.032 16.192 19.968 6.912 8 11.776 14.208 14.464 18.688 2.688 4.544 4.032 9.92 4.032 16.384 0 8.192-3.072 15.424-9.28 21.568-6.144 6.208-14.144 9.28-23.872 9.28S731.648 552.704 719.36 537.6c-12.16-15.104-27.968-42.368-47.168-81.664C652.672 491.328 639.552 514.752 632.96 526.08 626.24 537.28 619.84 545.792 613.696 551.616c-6.208 5.76-13.184 8.704-21.184 8.704-9.472 0-17.408-3.264-23.744-9.792C562.56 543.936 559.36 536.896 559.36 529.472c0-6.912 1.28-12.16 3.84-15.744 23.616-32.064 48.256-60.032 73.984-83.584C615.616 426.816 596.352 423.04 579.456 419.008 562.496 414.784 544.448 408.896 525.504 400.896c-3.136-1.536-6.144-5.12-9.088-10.624C513.408 384.832 512 379.712 512 375.04c0-8.96 3.264-16.512 9.792-22.528 6.592-6.144 14.08-9.088 22.592-9.088 6.208 0 13.824 1.856 23.104 5.568 9.216 3.776 20.928 9.152 35.2 16.192s30.528 14.912 48.768 23.68c-3.392-16.192-6.144-34.752-8.32-55.616-2.176-20.928-3.264-35.264-3.264-43.008 0-9.472 3.008-17.536 9.024-24.448 6.144-6.784 13.824-10.176 23.296-10.176 9.344 0 16.896 3.392 22.912 10.176 6.08 6.848 9.088 15.872 9.088 27.2 0 3.072-0.512 9.152-1.344 18.304-0.832 9.152-2.176 20.096-3.84 33.088-1.664 12.992-3.584 27.904-5.568 44.48 16.576-7.68 32.64-15.424 47.744-23.04 15.104-7.744 27.264-13.44 36.16-17.024 8.96-3.52 16.128-5.376 21.568-5.376 8.96 0 16.704 2.944 23.232 9.088C828.736 358.592 832 366.144 832 375.04 832 380.16 830.4 385.536 827.2 391.04z"
      fill="currentColor"
    ></path>
  </svg>
)

export enum ToolbarItemType {
  Close = 'close',
  Highlight = 'highlight',
  Annotation = 'annotation'
}

interface ToolbarItemProps {
  isActive?: boolean
  children: React.ReactElement | string
  onClick?: (type: ToolbarItemType) => void
  type: ToolbarItemType
  title?: string
}

const ToolbarItem = (props: ToolbarItemProps) => {
  return (
    <a
      className={clsx(
        'mhtml-plugin__toolbar-item',
        props.isActive ? 'is-active' : ''
      )}
      title={props.title}
      onClick={() => props.onClick?.(props.type)}
    >
      {props.children}
    </a>
  )
}

export interface ToolbarProps {
  isShowOutline?: boolean
}

export function Toolbar(props: ToolbarProps) {
  const { toggleHighlightMode, close, gotoAnnotationPage, isHighlightActive } =
    useViewerStore((state) => {
      return {
        toggleHighlightMode: state.toggleHighlightMode,
        close: state.close,
        gotoAnnotationPage: state.gotoAnnotationPage,
        isHighlightActive: state.viewerSetting.highlightMode
      }
    })

  return (
    <div className="mhtml-plugin__toolbar">
      <ToolbarItem
        isActive={isHighlightActive}
        type={ToolbarItemType.Highlight}
        title='highlight mode'
        onClick={toggleHighlightMode}
      >
        <HighlightMode />
      </ToolbarItem>
      <ToolbarItem
        type={ToolbarItemType.Annotation}
        title='go to annotation page'
        onClick={gotoAnnotationPage}
      >
        <AnnotationPage />
      </ToolbarItem>
      <ToolbarItem type={ToolbarItemType.Close} onClick={close}>
        Close
      </ToolbarItem>
    </div>
  )
}
