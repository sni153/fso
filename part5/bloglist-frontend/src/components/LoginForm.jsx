import PropTypes from 'prop-types';
import { TextField, Button, Typography } from '@mui/material';

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h3">Log in to Blog Beat</Typography>
      <div>
        <TextField
          id="username"
          label="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          id="password"
          label="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button id="login-button" type="submit" variant="contained" color="primary">
        login
      </Button>
    </form>
  );
};

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default LoginForm;