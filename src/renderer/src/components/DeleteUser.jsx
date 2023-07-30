import { InputText } from 'primereact/inputtext'
//import { Button } from 'primereact/button'

export default function DeleteUser() {
  return (
    <div>
      <h1 className="DeleteUserTitle">Delete User</h1>
      <div className="card flex justify-content-center">
        <div className="flex flex-column gap-2">
          <label htmlFor="reason">Reason:</label>
          <InputText id="reason" aria-describedby="reason-help" placeholder="Resgined" />
        </div>
      </div>
    </div>
  )
}
