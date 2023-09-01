import { useNavigate } from 'react-router-dom'

import { Panel } from 'primereact/panel'
import { Button } from 'primereact/button'
import { ScrollPanel } from 'primereact/scrollpanel'
import { TabView, TabPanel } from 'primereact/tabview'

import { questions, mobile } from '../assets/helpdata.json'

//import frame1 from "../assets/guides/loginExample.html"

const Help = () => {
  const navigator = useNavigate()

  return (
    <div className="flex flex-column align-items-center overflow-hidden" style={{ height: '97vh' }}>
      <div className="text-center mb-3">
        <h1>Help</h1>
        <Button onClick={() => navigator('/login')}>Go To Login</Button>
      </div>

      <TabView>
        <TabPanel header="Frequently Asked Questions" leftIcon="pi pi-question-circle mr-2">
          <ScrollPanel style={{ width: '97vw', height: '70vh' }}>
            <div className="grid gap-3 m-auto p-5 justify-content-center">
              {questions.map((item, i) => (
                <Panel className="col-5" collapsed key={i} header={item.questionText} toggleable>
                  <p>{item.answer}</p>
                </Panel>
              ))}
            </div>
          </ScrollPanel>
        </TabPanel>

        <TabPanel header="Tutorials" leftIcon="pi pi-book mr-2">
          <ScrollPanel style={{ width: '97vw', height: '70vh' }}>
            <div className="flex flex-column gap-2">
              <Panel collapsed header="How to login" toggleable></Panel>
              <Panel collapsed header="How to reset password" toggleable></Panel>
              <Panel collapsed header="How to turn of sound alerts" toggleable></Panel>
            </div>
          </ScrollPanel>
        </TabPanel>

        <TabPanel header="Mobile App" leftIcon="pi pi-tablet mr-2">
          <ScrollPanel style={{ width: '97vw', height: '70vh' }}>
            <div className="grid gap-3 m-auto p-5 justify-content-center">
              {mobile.map((item, i) => (
                <Panel className="col-5" collapsed key={i} header={item.questionText} toggleable>
                  <p>{item.answer}</p>
                </Panel>
              ))}
            </div>
          </ScrollPanel>
        </TabPanel>

        <TabPanel header="Contact" leftIcon="pi pi-envelope mr-2">
          <ScrollPanel style={{ width: '97vw', height: '70vh' }}>
            <div className="grid gap-3 m-auto p-5 justify-content-center">
              <p className="m-0">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
                excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
                officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
                eligendi optio cumque nihil impedit quo minus.
              </p>
              <div className="col-item details-col">
                <h3>Client Support</h3>
                <p>
                  <a href="">
                    <Button label="catalystcrew@gmail.com" rounded />
                  </a>
                </p>
              </div>
            </div>
          </ScrollPanel>
        </TabPanel>
      </TabView>
    </div>
  )
}

export default Help
