export interface GridTile {
  id: string,
  column: number,
  row: number,
  lastMaintainenceDate?: Date,
  safeToMaintain?: boolean
}
