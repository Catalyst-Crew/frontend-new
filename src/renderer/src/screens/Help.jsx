import { useNavigate } from 'react-router-dom'

import { Panel } from 'primereact/panel'
import { Button } from 'primereact/button'
import { ScrollPanel } from 'primereact/scrollpanel'
import { TabView, TabPanel } from 'primereact/tabview'

import { questions, tutorial } from '../assets/helpdata.json'
import { API_URL } from '../utils/exports'

//import frame1 from "../assets/guides/loginExample.html"

const Help = () => {
  const navigator = useNavigate();
  const EMAIL = "catalystcrew@mts.co.za"

  return (
    <div
      className="flex flex-column align-items-center justify-content-center align-content-center overflow-hidden"
      style={{ height: '97vh' }}
    >
      <div className="text-center mb-3">
        <h1>Help</h1>
        <Button onClick={() => navigator('/')}>Go To Login</Button>
      </div>

      <TabView>
        <TabPanel header="FAQ" leftIcon="pi pi-question-circle mr-2">
          <ScrollPanel style={{ width: '96vw', height: '70vh' }}>
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
          <ScrollPanel style={{ width: '96vw', height: '70vh' }}>
            <div className="flex flex-column gap-2">
              {tutorial.map((item) => <Panel
                key={item.id}
                collapsed
                header={item.questionText}
                toggleable
              >
                <div className='px-6'>
                  <p>{item.answerText}</p>
                  {
                    item.media.map((media) => <>
                      {media.type === "video" ?
                        <video width={800} controls autoPlay src={`${API_URL}/static/${media.source}`} />
                        :
                        <image width={800} controls autoPlay src={`${API_URL}/static/${media.source}`} />}
                    </>)
                  }
                </div>
              </Panel>)}
            </div>
          </ScrollPanel>
        </TabPanel>

        {/* <TabPanel header="Mobile App" leftIcon="pi pi-tablet mr-2">
          <ScrollPanel style={{ width: '97vw', height: '70vh' }}>
            <div className="grid gap-3 m-auto p-5 justify-content-center">
              {mobile.map((item, i) => (
                <Panel className="col-5" collapsed key={i} header={item.questionText} toggleable>
                  <p>{item.answer}</p>
                </Panel>
              ))}
            </div>
          </ScrollPanel>
        </TabPanel> */}

        <TabPanel header="Contact" leftIcon="pi pi-envelope mr-2">
          <ScrollPanel style={{ width: '96vw', height: '70vh' }}>
            <div className="grid gap-3 m-auto p-5 justify-content-center flex flex-column">

              <div>
                <table style={{ margin: "auto" }} className='help-table'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Devision</th>
                      <th>Email</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <thead>
                    <tr>
                      <td>1</td>
                      <td>Sam</td>
                      <td>Rescue</td>
                      <td><a href="mailto:sam@mail.com">sam@mail.com</a> </td>
                      <td>011 234 5678</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Nkosikhona Radebe</td>
                      <td>Rescue (Lead)</td>
                      <td><a href="mailto:nkosikhonar@mail.com">nkosikhonar@mail.com</a> </td>
                      <td>011 432 5678</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Yonela Charlie</td>
                      <td>Emergrncy Personnel</td>
                      <td><a href="mailto:yonelac@mail.com">yonelac@mail.com</a> </td>
                      <td>011 342 5678</td>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="col-item details-col text-center">
                <h3>Email Support</h3>
                <p>
                  <a href={`mailto:${EMAIL}`}>
                    <Button label={EMAIL} rounded />
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
