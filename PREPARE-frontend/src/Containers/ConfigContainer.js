import React, { useState, useEffect } from 'react';
import { Row, Grid, Col, Nav, NavItem, Tab, Button, Table, Glyphicon, ToggleButton, ButtonGroup, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import axios from 'axios';
import './ConfigContainer.css';
import Swal from 'sweetalert2';
import backendlink from '../../config/links.js';

const ConfigContainer = () => {
  const [configData, setConfigData] = useState([]);
  const [protocolType, setProtocolType] = useState('UDP');
  const [fs, setFs] = useState('');
  const [channels, setChannels] = useState('');
  const channelOptions = [1, 2, 4, 8];
  const fsOptions = [8000, 16000, 22050, 44100, 48000, 96000];
  const [apiData, setApiData] = useState([
    {
      name: 'Lookup Medical Synonymn',
      checkurl: backendlink.checkMedicalSynonymnAPI,
      active: false,
      openurl: backendlink.scriptOpenCLoseAPILink + '/open-medicalSynonyms',
      closeurl: backendlink.scriptOpenCLoseAPILink + '/close-medicalSynonyms'
    },
    {
      name: 'Multicast Audio Transcription',
      checkurl: backendlink.checkMulticastTranscriptionStreamAPI,
      active: false,
      openurl: backendlink.scriptOpenCLoseAPILink + '/open-multicastTranscriptionStream',
      closeurl: backendlink.scriptOpenCLoseAPILink + '/close-multicastTranscriptionStream'
    },
    {
      name: 'Online Training',
      checkurl: backendlink.checkScenarioTrainingAPI,
      active: false,
      openurl: backendlink.scriptOpenCLoseAPILink + '/open-scenarioTraining',
      closeurl: backendlink.scriptOpenCLoseAPILink + '/close-scenarioTraining'
    },
    {
      name: 'Event Detection',
      checkurl: backendlink.checkEventDetectionAPI,
      active: false,
      openurl: backendlink.scriptOpenCLoseAPILink + '/open-eventDetection',
      closeurl: backendlink.scriptOpenCLoseAPILink + '/close-eventDetection'
    },
  ]);
  // Function to check status of API
  const checkAPIStatus = async (checkurl) => {
    try {
      const res = await fetch(checkurl + '/status-check');
      return res.ok; // Return whether status is OK
    } catch (error) {
      return false;
    }
  };
  // Fetch the status of API

  useEffect(() => {
    apiData.forEach((api, index) => {
      if (api.checkurl) {
        checkAPIStatus(api.checkurl).then((isActive) => {
          setApiData((prevData) => {
            const newData = [...prevData];
            newData[index].active = isActive;
            return newData;
          });
        });
      }
    });
  }, []);
  useEffect(() => {
    axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
    axios.get(backendlink.backendlink + '/getAudioStream')
      .then(response => {
        const data = response.data.data; // Access the data property of the response's data
        setConfigData(data);
        console.log(data)
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }, []);

  // Add a new configuration to a database
  const handleSubmit = (event) => {
    event.preventDefault();
    const Room = event.target.room.value;
    const Ip = event.target.ip.value;
    const Port = event.target.port.value;
    const Protocol = protocolType;
    const Fs = fs;
    const Channels = channels;

    // Validate RTP-specific fields
    if (Protocol === 'RTP' && (!Fs || !Channels)) {
      Swal.fire('Error', 'Sampling Frequency and Number of Channels are required for RTP protocol', 'error');
      return;
    }

    // Send the new config to the backend
    axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
    axios.post(backendlink.backendlink + '/addAudioStream', { Room, Ip, Port, Protocol, Fs, Channels })
      .then(response => {
        // If the backend was successful in adding the config, add it to our local state
        if (response.status === 200) {
          setConfigData([...configData, { Room, Ip, Port }]);
          Swal.fire(' Audio Stream added ', 'The new audio stream configuration has been successfully added.', 'success');
          setTimeout(function() {
            location.reload();
        }, 1500);
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });

    // Reset the form
    event.target.reset();
    setProtocolType('UDP');
    setFs('');
    setChannels('');
  };

  const handleDelete = (configId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this configuration?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.value) {
        axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
        axios.delete(`${backendlink.backendlink}/deleteAudioStream/${configId}`)
          .then(response => {
            // If the backend was successful in deleting the config, remove it from our local state
            if (response.status === 200) {
              setConfigData(configData.filter(config => config.Id !== configId));
              Swal.fire(' Audio Stream deleted ', 'The audio stream configuration has been successfully deleted.', 'info');
              setTimeout(function() {
                location.reload();
            }, 1500);
            }
          })
          .catch(error => {
            console.log('Error:', error);
          });
      }
    });
  }


  // Handle toggle change button for API status:
  const onOffApi = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok; // Return whether status is OK
    } catch (error) {
      console.log('Error:', error);
      return false;
    }
  };



  return (
    <Grid className="whiteBackground">
      <Row>
        <Col sm={12}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="audioNLP">
            <Row className="clearfix">
              <Col className="sidemenu93872" sm={3}>
                <Nav bsStyle="pills" stacked>
                  <NavItem className="sideMenu1" eventKey="audioNLP">
                    <span className="sideMenu">
                      <Glyphicon glyph="list-alt" />
                    </span>&nbsp; &nbsp; &nbsp; Event Detection(Audio via NLP)
                  </NavItem>
                  <NavItem className="sideMenu1" eventKey="videoPlayback">
                    <span className="sideMenu">
                      <Glyphicon glyph="share-alt" />
                    </span>&nbsp; &nbsp; &nbsp; API Configuration
                  </NavItem>
                </Nav>
              </Col>
              <Col className="mainContent12342" sm={9}>
                <Tab.Content animation>
                  <Tab.Pane eventKey="audioNLP">
                    <form onSubmit={handleSubmit}>
                      <h4><b>Add New Configuration</b></h4>
                      <br />
                      <Table>
                        <tbody>
                          <tr>
                            <td className="label-cell">Room:</td>
                            <td className="input-cell">
                              <FormControl type="text" name="room" required />
                            </td>
                          </tr>
                          <tr>
                            <td className="label-cell">IP:</td>
                            <td className="input-cell">
                              <FormControl type="text" name="ip" required />
                            </td>
                          </tr>
                          <tr>
                            <td className="label-cell">Port:</td>
                            <td className="input-cell">
                              <FormControl type="number" name="port" required />
                            </td>
                          </tr>
                          <tr>
                            <td className="label-cell">Protocol Type:</td>
                            <td className="input-cell">
                              <FormControl
                                componentClass="select"
                                value={protocolType}
                                onChange={(e) => setProtocolType(e.target.value)}
                              >
                                <option value="UDP">UDP</option>
                                <option value="RTP">RTP</option>
                              </FormControl>
                            </td>
                          </tr>
                          {protocolType === 'RTP' && (
                            <React.Fragment>
                              <tr>
                                <td className="label-cell">Sampling Frequency (Hz):</td>
                                <td className="input-cell">
                                  <FormControl
                                    componentClass="select"
                                    value={fs}
                                    onChange={(e) => setFs(e.target.value)}
                                    required
                                  >
                                    <option value="">Select Sampling Frequency</option>
                                    {fsOptions.map((option) => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}


                                  </FormControl>
                                </td>
                              </tr>
                              <tr>
                                <td className="label-cell">Number of Channels:</td>
                                <td className="input-cell">
                                  <FormControl
                                    componentClass="select"
                                    value={channels}
                                    onChange={(e) => setChannels(e.target.value)}
                                    required
                                  >
                                    <option value="">Select Number of Channels</option>
                                    {channelOptions.map((option) => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}

                                  </FormControl>
                                </td>
                              </tr>
                            </React.Fragment>
                          )}
                        </tbody>
                      </Table>
                      <Button className="btn-success" type="submit">Add Config</Button>
                    </form>
                    <br />
                    <Table striped bordered condensed hover>
                      <thead>
                        <tr>
                          <th className="bold-header">Room</th>
                          <th className="bold-header">IP</th>
                          <th className="bold-header">Port</th>
                          <th className="bold-header">Protocol</th>
                          <th className="bold-header">Sampling Frequency</th>
                          <th className="bold-header">Number of Channels</th>
                          <th className="bold-header">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {configData && configData.map((config, index) => (
                          <tr key={index}>
                            <td className="bold-cell">{config.Room}</td>
                            <td className="bold-cell">{config.Ip}</td>
                            <td className="bold-cell">{config.Port}</td>
                            <td className="bold-cell">{config.Protocol}</td>
                            <td className="bold-cell">{config.Fs || '-'}</td>
                            <td className="bold-cell">{config.Channels || '-'}</td>
                            <td>
                              <Button className="btn-danger" onClick={() => handleDelete(config.Id)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                  <Tab.Pane eventKey="videoPlayback">
                    <h4><b>Change API Status</b></h4>
                    <br />
                    <br />
                    <Table striped bordered condensed hover>
                      <thead>
                        <tr>
                          <th className="bold-header">API Name</th>
                          <th className="bold-header">Status</th>
                          <th className="bold-header">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiData.map((api, index) => (
                          <tr key={index}>
                            <td className="bold-cell">{api.name}</td>
                            <td className="bold-cell">{api.active ? "Active" : "Inactive"}</td>
                            <td>
                              <ButtonGroup>
                                <ToggleButton
                                  type="checkbox"
                                  variant={api.active ? "success" : "outline-secondary"}
                                  checked={api.active}
                                  value="1"
                                  onChange={async () => {
                                    const confirmMessage = api.active
                                      ? `Are you sure you want to turn off ${api.name}?`
                                      : `Are you sure you want to turn on ${api.name}?`;
                                    Swal.fire({
                                      title: 'Are you sure?',
                                      text: confirmMessage,
                                      type: 'warning',
                                      showCancelButton: true,
                                      confirmButtonText: 'Yes',
                                      cancelButtonText: 'No',
                                    }).then(async (result) => {
                                      if (result.value) {
                                        const url = api.active ? api.closeurl : api.openurl;
                                        const responseOk = await onOffApi(url);
                                        if (responseOk) {
                                          const newActiveStatus = !api.active;
                                          setApiData((prevData) => {
                                            const newData = [...prevData];
                                            newData[index].active = newActiveStatus;
                                            return newData;
                                          });
                                        } else {
                                          console.log(`Failed to toggle API at ${url}`);
                                          Swal.fire(' API Down ', 'The Script Open Close API is currently down. Please try again once it has been resumed.', 'error');
                                        }
                                      }
                                    });
                                  }}
                                >
                                  {api.active ? "On" : "Off"}
                                </ToggleButton>



                              </ButtonGroup>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    </Grid>
  );
};

export default ConfigContainer;