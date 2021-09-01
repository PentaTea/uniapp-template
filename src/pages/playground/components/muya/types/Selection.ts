export interface Block {
  key: string
  text: string
  type: string
  editable: boolean
  parent: string
  preSibling?: any
  nextSibling?: any
  children: any[]
  functionType: string
}

export interface Start {
  key: string
  offset: number
  type: string
  block: Block
}

export interface End {
  key: string
  offset: number
  type: string
  block: Block
}

export interface Children {
  key: string
  text: string
  type: string
  editable: boolean
  parent: string
  preSibling?: any
  nextSibling?: any
  children: any[]
  functionType: string
}

export interface Affiliation {
  key: string
  text: string
  type: string
  editable: boolean
  parent?: any
  preSibling?: any
  nextSibling?: any
  children: Children[]
}

export interface CursorCoord {
  x: number
  y: number
  width: number
}

export interface Selection {
  start: Start
  end: End
  affiliation: Affiliation[]
  cursorCoords: CursorCoord
}
