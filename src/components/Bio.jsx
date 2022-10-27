import { useEffect, useState } from 'react'
import getPhotoUrl from 'get-photo-url'
import profileIcon from '../assets/profileIcon.svg'
import { db } from '../dexie'

const Bio = () => {
  const [userDetails, setUserDetials] = useState({
    name: 'Awoniyi Tosin',
    about: '#Olorikay'
  })

  const [editFormIsOpen, setEditFormIsOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profileIcon)

  useEffect(()=> {
    const setDataFromDb = async () => {
      const userDetailsFromDb = await db.bio.get('info')
      const profilePhotoFromDb = await db.bio.get('profilePhoto')
      userDetailsFromDb && setUserDetials(userDetailsFromDb)
      profilePhotoFromDb && setProfilePhoto(profilePhotoFromDb)
    }
    setDataFromDb()
  })

  const updateUser = async (event) => {
    event.preventDefault()
    const objectData = {
      name: event.target.nameOf.value,
      about: event.target.aboutUser.value,
    }
    setUserDetials(objectData)
    await db.bio.put(objectData, 'info')
    setEditFormIsOpen(false)
  }


    const editForm = (
        <form className='edit-bio-form' onSubmit={(e) => updateUser(e)}>
            <input type="text" id='' name='nameOf' defaultValue={userDetails?.name} placeholder='Your name' />
            <input type="text" id='' name='aboutUser' defaultValue={userDetails?.about} placeholder='About you' maxLength="100"/>
            <br />
            <button type='button' className='cancel-button' onClick={()=> setEditFormIsOpen(false)}>cancel</button>
            <button type='submit'>Save</button>
        </form>
    )
    const closeForm = (<button onClick={()=> setEditFormIsOpen(true)}>Edit</button>)

    const updateProfilePhoto = async () => {
      const newProfilePhoto = await getPhotoUrl('#profilePhotoInput')
      setProfilePhoto(newProfilePhoto)
      await db.bio.put(newProfilePhoto, 'profilePhoto')
    }

    return(
        <section className="bio">
          <input type="file" accept="image/*" name='photo' id='profilePhotoInput'/>
          <label htmlFor='profilePhotoInput' onClick={updateProfilePhoto}>
            <div className="profile-photo" role="button" title="click to edit photo">
            <img src={profilePhoto} alt="" />
            </div>
          </label>
          <div className='profile-info'>
            <p className='name'>{userDetails.name}</p>
            <p className='about'>{userDetails.about}</p>
            
            {editFormIsOpen ? editForm : closeForm}
          </div>
        </section>
    )
}

export default Bio