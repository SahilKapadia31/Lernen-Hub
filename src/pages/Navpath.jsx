import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import arraow_svg from '../assets/svg/arrow-right.svg'
import { setEncryptedData, getDecryptedData, removeData } from '../utils/helperFunctions';

const Navpath = ({ count3, type, course_id, group_id, navPaths }) => {
  const stringLength = 25;
  const [name, setname] = useState("");
  const [path, setpath] = useState("");
  const [name2, setname2] = useState("");
  const [path2, setpath2] = useState("");
  const [name3, setname3] = useState("");
  const [path3, setpath3] = useState("");
  const [name4, setname4] = useState("");
  const [path4, setpath4] = useState("");

  useEffect(() => {
    setname(JSON.parse(getDecryptedData('name')))
    setpath(JSON.parse(getDecryptedData('path')))
    setname2(JSON.parse(getDecryptedData('name2')))
    setpath2(JSON.parse(getDecryptedData('path2')))
    setname3(JSON.parse(getDecryptedData('name3')))
    setpath3(JSON.parse(getDecryptedData('path3')))
    setname4(JSON.parse(getDecryptedData('name4')))
    setpath4(JSON.parse(getDecryptedData('path4')))
  }, [count3, course_id, group_id])

  type = "group"
  
  return (
    <>
      <div className='d-flex flex-wrap gap-2 pb-3 mt-2 mt-lg-0'>
        {navPaths && navPaths.length > 0 ?
          <>
            {navPaths.map((item, index) => (
              <span style={{ color: type ? '#98999a' : '#2A3941' }}>
                {index != 0 && <> &nbsp;<img src={arraow_svg} alt='arrow' />
                  &nbsp;&nbsp;&nbsp;
                </>
                }
                <Link className='nav_paths' style={{ color: type ? '#98999a' : 'rgb(93, 95, 227)', textDecoration: 'none', textTransform: 'capitalize',fontWeight:600 }} to={item.path}>{item?.name.length > stringLength ? item?.name.slice(0,stringLength)+'...' : item?.name}</Link>
              </span>
            ))
            }
          </>
          :
          <>
            {path != undefined && name != undefined ?
              (<span style={{ color: type ? '#98999a' : '#2A3941' }}>
                <Link className='nav_paths' style={{ color: type ? '#98999a' : 'rgb(93, 95, 227)', textDecoration: 'none', textTransform: 'capitalize',fontWeight:600 }} to={path}>{name.length > stringLength ? name.slice(0,stringLength)+'...' : name}</Link>
              </span>) :
              (<></>)
            }

            {path2 != undefined && name2 != undefined ? (
              <span className='ms-2' style={{ color: type ? '#98999a' : '#2A3941' }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M5.29238 6.00008L0.692383 1.40008L1.40008 0.692383L6.70778 6.00008L1.40008 11.3078L0.692383 10.6001L5.29238 6.00008Z" fill="currentColor" />
                </svg>
                &nbsp;&nbsp;&nbsp;
                <Link className='nav_paths' style={{ color: type ? '#98999a' : 'rgb(93, 95, 227)', textTransform: 'capitalize',fontWeight:600,textDecoration: 'none' }} to={path2}>{name.length > stringLength ? name.slice(0,stringLength)+'...' : name}</Link>
              </span>) :
              (<></>)
            }

            {path3 != undefined && name3 != undefined ?
              (<span style={{ color: type ? '#98999a' : '#2A3941' }} className='ms-2'>
                <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M5.29238 6.00008L0.692383 1.40008L1.40008 0.692383L6.70778 6.00008L1.40008 11.3078L0.692383 10.6001L5.29238 6.00008Z" fill="currentColor" />
                </svg>
                &nbsp;&nbsp;&nbsp;
                <Link style={{ color: type ? '#98999a' : 'rgb(93, 95, 227)', textTransform: 'capitalize', fontSize: '14px',fontWeight:600,textDecoration:'none' }} to={path3}>{name.length > stringLength ? name.slice(0,stringLength)+'...' : name}</Link>
              </span>) :
              (<></>)
            }
          </>
        }
      </div>
    </>

  )
}

export default Navpath