import CopyText from './CopyText'

import { Badge } from 'primereact/badge'
import { Avatar } from 'primereact/avatar'

const username = (user) => {
  let name = ''
  let id = ''

  id = user?.id_prefix ? ` ${user.id_prefix}${user.id}` : user.user_id_prefix + user.user_id

  if (user.user_name.includes(' ')) {
    const nameArr = user.user_name.split(' ')
    name = nameArr[0][0] + nameArr[1][0]
  } else {
    name = user.user_name.substring(0, 2)
  }

  return (
    <div className="flex align-items-center">
      <Avatar
        className="p-overlay-badge"
        label={name.toUpperCase()}
        size="large"
        style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
        shape="circle"
      >
        {user.user_id_prefix === 'user-' ? (
          <Badge
            severity={
              user.access_name === 'GRANTED'
                ? 'success'
                : user.access_name === 'BLOCKED'
                ? 'warning'
                : 'danger'
            }
          />
        ) : (
          <Badge severity={user.sensor_id ? 'success' : 'danger'} />
        )}
      </Avatar>
      <div className="ml-2">
        <p className="font-bold m-0 p-0">
          {`${user.user_name} `}
          <CopyText text={id} />
        </p>
        <p className="text-sm m-0 p-0">{user.email}</p>
      </div>
    </div>
  )
}

export default username
