import * as React from 'react'
import { Menu, MenuItem, makeStyles } from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

const useStyles = makeStyles((theme) => ({
  menuItem: {
    backgroundColor: ({ isSubMenuOpen }) =>
      isSubMenuOpen ? theme.palette.action.hover : 'transparent',
    minWidth: '12rem'
  },
  contentContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    paddingRight: 6
  },
  expandIcon: {
    fontSize: 12
  }
}), { index: 1 })

const NestedMenuItem = React.forwardRef(
  (
    {
      id: parentId,
      name: parentName,
      childrenItems: parentChildrenItems = [],
      fullPath,
      onClick,
      apiType
    },
    ref
  ) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const isSubMenuOpen = Boolean(anchorEl)
    const classes = useStyles({ isSubMenuOpen })
    const hasChildrenItems = parentChildrenItems?.length || false
    const isLeafNode = !hasChildrenItems

    const handleMouseEnter = (event) => {
      setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
      setAnchorEl(null)
    }

    const handleClick = (event) => {
      event.stopPropagation()
      if (isLeafNode) {
        onClick(fullPath, apiType)
        handleClose()
      }
    }

    return (
      <MenuItem
        ref={ref}
        disableRipple
        className={classes.menuItem}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleClose}
      >
        <div className={classes.contentContainer}>
          <span className={classes.name}>{parentName}</span>
          {hasChildrenItems && (
            <ArrowForwardIosIcon className={classes.expandIcon} />
          )}
        </div>
        {hasChildrenItems && (
          <>
            <Menu
              // "pointerEvents: none" to prevent invisible Popover wrapper div to capture mouse events
              style={{ pointerEvents: 'none' }}
              anchorEl={anchorEl}
              open={isSubMenuOpen}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              PaperProps={{
                elevation: 4
              }}
            >
              {/* reset pointer event here so that the menu items could receive mouse events */}
              <div style={{ pointerEvents: 'auto' }}>
                {parentChildrenItems.map((item, i) => {
                  const { id, name, children, fullPath, type } = item
                  return (
                    <NestedMenuItem
                      key={`${name}${i}`}
                      id={id + i}
                      name={name}
                      childrenItems={children}
                      onClick={onClick}
                      fullPath={fullPath}
                      apiType={type}
                    />
                  )
                })}
              </div>
            </Menu>
          </>
        )}
      </MenuItem>
    )
  }
)

export default NestedMenuItem
