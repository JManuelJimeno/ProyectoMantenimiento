import '../styles/LoginPage.css';
import logoUser from '../img/user.png';
import { useStateContext } from '../contexts/ContextProvider';
import { useTitle } from '../hooks/useTitle';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import fetchAJAX from '../helpers/fetch';
import Message from '../components/loader message/Message';
import Loader from '../components/loader message/Loader';


const initialForm = {
  correo: "",
  pass: "",
};

export const LoginPage = ({ rol }) => {

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageError, setMessageError] = useState('');
  let pages = useNavigate();

  const { currentMode, handleAuth, authUser, setRolConcurrentUser } = useStateContext();
  //setRolConcurrentUser(rol);
  useTitle('Dashboard IoT | Login ' + rol);

  //Auth - LogIn   PENDIENTE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: (e.target.value.trim()).toLowerCase(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.correo || !form.pass) {
      setError(true);
      setMessageError('Datos incompletos');
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    } else {

      fetchAJAX({
        url: 'http://localhost:5051/selectuserauth',
        settings: {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        },
        resSuccess: (res) => {
          if (res.success) {
            setRolConcurrentUser(rol);
            handleAuth(true);
            window.localStorage.setItem('authUser', true);
            setError(false);
            setMessageError('');
            setLoading(false);
            pages('/');
          } else {
            setMessageError(res.message);
            handleAuth(false);
            setError(true);
          }

        },
        resError: (error) => {
          setError(true);
          setMessageError(error);
          setTimeout(() => {
            setError(false);
          }, 10000);
        }
      })

    }
    handleReset();
  };

  const handleReset = (e) => {
    setForm(initialForm);
  };

  //=======================

  return (
    <>
      {authUser === 'true' ? <Navigate to='/' /> : (
        <>
          {error && <Message msg={messageError} bgColor={'#DC4C64'} />}
          {loading && <Loader />}
          <div className='Login'>
            <div className="seccion">
              <div className="card glass" style={{
                boxShadow: `0px 8px 32px 0 ${currentMode === 'Light' ? '#000000' : '#ffffff'}50`,
              }}>
                <div className="card-content">
                  <div className="imagen">
                    <img src={logoUser} alt='logoUser' />
                  </div>
                  <div className="rol-Admin">
                    <h3>{rol}</h3>
                  </div>

                  <form onSubmit={handleSubmit} id="login-form" className='login-form'>
                    <div className="input-form in-Text">
                      <label htmlFor="correo" className="form-label">Correo</label>
                      <input onChange={handleChange} type="text" className="form-control"
                        id="correo" name="correo" aria-describedby="emailHelp"
                        placeholder='Ingrese su usuario' value={form.correo} />
                    </div>
                    <div className="input-form in-pass">
                      <label htmlFor="pass" className="form-label">Contraseña</label>
                      <input onChange={handleChange} type="password" className="form-control"
                        id="pass"
                        placeholder='Ingrese su contraseña' value={form.pass}
                        name="password"
                      />
                    </div>
                    <button type="submit" className="btn-Submit">Entrar</button>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
