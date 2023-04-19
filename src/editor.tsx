import React, { useCallback } from 'react'
import clsx from 'clsx'

export enum HighlightColor {
  None = '',
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
  Lime = 'lime',
  Cyan = 'cyan',
  Indigo = 'indigo',
}

export const ColorMap: Record<HighlightColor, string> = {
  [HighlightColor.None]: '',
  [HighlightColor.Red]: 'rgb(248 113 113)',
  [HighlightColor.Orange]: 'rgb(251 146 60)',
  [HighlightColor.Yellow]: 'rgb(250 204 21)',
  [HighlightColor.Lime]: 'rgb(163 230 53)',
  [HighlightColor.Cyan]: 'rgb(34 211 238)',
  [HighlightColor.Indigo]: 'rgb(129 140 248)',
}

export type EditorContent = {
  color: HighlightColor;
  isUnderline: boolean;
  comment?: string;
}

export type EditorProps = EditorContent & {
  onChange?: (content: EditorContent) => void;
}

export function Editor(props: EditorProps) {

  const handleColorChange = (color: HighlightColor) =>
    props.onChange?.({ color, isUnderline: props.isUnderline, comment: props.comment })
  const handleUnderlineChange = () =>
    props.onChange?.({ color: props.color, isUnderline: !props.isUnderline, comment: props.comment })
  const handleCommentChange = (e: React.FormEvent<HTMLInputElement>) =>
    props.onChange?.({ color: props.color, isUnderline: props.isUnderline, comment: (e.nativeEvent as InputEvent).data ?? '' })

  return (
    <div className='w-52 h-16 flex flex-col rounded-lg overflow-hidden shadow-lg bg-gray-100'>
      <div className='h-1/2 flex flex-row items-center justify-between'>
        <div className='h-full flex flex-row items-center'>
          <ColorButton/>
          <ColorButton active={props.color === HighlightColor.Red} color={HighlightColor.Red} onClick={handleColorChange}/>
          <ColorButton active={props.color === HighlightColor.Orange} color={HighlightColor.Orange} onClick={handleColorChange}/>
          <ColorButton active={props.color === HighlightColor.Yellow} color={HighlightColor.Yellow} onClick={handleColorChange}/>
          <ColorButton active={props.color === HighlightColor.Lime} color={HighlightColor.Lime} onClick={handleColorChange}/>
          <ColorButton active={props.color === HighlightColor.Cyan} color={HighlightColor.Cyan} onClick={handleColorChange}/>
          <ColorButton active={props.color === HighlightColor.Indigo} color={HighlightColor.Indigo} onClick={handleColorChange}/>
      </div>
        <div 
          className='h-full p-1.5 flex justify-center items-center border-l text-base cursor-pointer'
          onClick={handleUnderlineChange}
        >
          <Underline active={props.isUnderline} color={props.color}/>
        </div>
      </div>
      <div className='h-1/2 border-t'>
        <input 
          type='text' 
          value={props.comment} 
          className='block h-full w-full outline-none p-1'
          onInput={handleCommentChange}
        />
      </div>
    </div>
  )
}

type ColorButtonProps = {
  color?: HighlightColor;
  active?: boolean;
  onClick?: (color: HighlightColor) => void;
}

function ColorButton({ color = HighlightColor.None, active = false, onClick }: ColorButtonProps) {
  const handleClick = useCallback(() => {
    onClick?.(color)
  }, [color, onClick])

  const activeClass = 'ring-2'

  if (color === HighlightColor.None) {
    return <div className={clsx('w-4 h-4 mx-1 rounded-full border border-gray-400 border-dashed cursor-pointer')} onClick={handleClick}/>
  }

  const colorClass = `bg-${color}-400`
  return <div className={clsx('w-4 h-4 mx-1 rounded-full cursor-pointer hover:ring-2', colorClass, active && activeClass)} onClick={handleClick}/>
}

function Underline({ active = false, color = HighlightColor.None }) {
  const colorClass = active && color ? `fill-${color}-400` : `fill-gray-300`
  return (
    <svg className={clsx('h-full w-full', colorClass)} viewBox="0 0 1024 1024">
      <path d="M86.48544 127.424q-21.152-1.152-25.728-2.272l-1.728-50.272q7.424-0.576 22.848-0.576 34.272 0 64 2.272 75.424 4 94.848 4 49.152 0 96-1.728 66.272-2.272 83.424-2.848 32 0 49.152-1.152l-0.576 8 1.152 36.576 0 5.152q-34.272 5.152-70.848 5.152-34.272 0-45.152 14.272-7.424 8-7.424 75.424 0 7.424 0.288 18.56t0.288 14.56l0.576 130.848 8 160q3.424 70.848 29.152 115.424 20 33.728 54.848 52.576 50.272 26.848 101.152 26.848 59.424 0 109.152-16 32-10.272 56.576-29.152 27.424-20.576 37.152-36.576 20.576-32 30.272-65.152 12-41.728 12-130.848 0-45.152-2.016-73.152t-6.272-70.016-7.712-91.136l-2.272-33.728q-2.848-38.272-13.728-50.272-19.424-20-44-19.424l-57.152 1.152-8-1.728 1.152-49.152 48 0 117.152 5.728q43.424 1.728 112-5.728l10.272 1.152q3.424 21.728 3.424 29.152 0 4-2.272 17.728-25.728 6.848-48 7.424-41.728 6.272-45.152 9.728-8.576 8.576-8.576 23.424 0 4 0.864 15.424t0.864 17.728q4.576 10.848 12.576 226.272 3.424 111.424-8.576 173.728-8.576 43.424-23.424 69.728-21.728 37.152-64 70.272-42.848 32.576-104 50.848-62.272 18.848-145.728 18.848-95.424 0-162.272-26.272-68-26.848-102.272-69.728-34.848-43.424-47.424-111.424-9.152-45.728-9.152-135.424l0-190.272q0-107.424-9.728-121.728-14.272-20.576-84-22.272zM936.78944 932.576l0-36.576q0-8-5.152-13.152t-13.152-5.152l-841.152 0q-8 0-13.152 5.152t-5.152 13.152l0 36.576q0 8 5.152 13.152t13.152 5.152l841.152 0q8 0 13.152-5.152t5.152-13.152z"></path>
    </svg>
  )
}