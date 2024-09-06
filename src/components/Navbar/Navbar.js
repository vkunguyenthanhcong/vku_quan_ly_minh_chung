import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { getThongTinDangNhap } from '../../services/apiServices';

const Navbar = ({ toggleMenuWidth }) => {
  const currentYear = new Date().getFullYear();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await getThongTinDangNhap(token);
        setUser(userData.user);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);
  return (
    <div className='nav-menu' style={{paddingTop : '10px', paddingBottom : '10px'}}>
      <ul className='d-flex justify-content-end align-items-center' style={{marginRight : '50px', flexWrap : 'wrap'}}>
        <li className='nav-item-left'>
          <button style={{marginLeft : '10px'}} className='toggle-icon' onClick={toggleMenuWidth}>
            <i className='fas fa-bars'></i>
          </button>
        </li>
        <li className='pc-margin-right' style={{ padding: '10px', fontSize: '14px' }}>
          <img
            style={{
              width: '29px',
              marginRight: '10px',
              maxHeight: '29px',
              borderRadius: '50%',
            }}
            alt={user ? `${user.fullName}` : 'User Avatar'}
            src={'https://daotao.vku.udn.vn/uploads/sinhvien/20IT199.jpg'}
          />
          {user && <span>{user.fullName}</span>}
        </li>
        <li className=''  style={{padding : '10px', fontSize : '14px'}}><span>Năm {currentYear}</span></li>
      </ul>
    </div>
  );
};
export default Navbar;