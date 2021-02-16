import { createMuiTheme } from '@material-ui/core/styles'
import lightBlue from '@material-ui/core/colors/lightBlue'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: lightBlue[300],
      main: lightBlue[500],
      dark: lightBlue[700],
    },
    secondary: {
      light: lightBlue.A100,
      main: lightBlue.A200,
      dark: lightBlue.A700,
    },
  },
})

export default theme
