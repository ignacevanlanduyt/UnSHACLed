import * as React from 'react';
import {Modal, Image, Header, Table, Loader, Dimmer} from 'semantic-ui-react';
import {UserModalProps} from '../components/interfaces/interfaces';
import RequestModule from '../requests/RequestModule';

/**
 Component used to create a modal containing user info of the currently authenticated user.
 Requires several props from the parent, which can be found in interfaces.d.ts

 */
class UserModal extends React.Component<UserModalProps, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            userObject: {},
            loaded: false
        };
    }

    /**
     * Method immediately invoked when this component is mounted.
     * Will request the user object from the currently authenticated user through the Request module
     * and set the component state according to its results.
     */
    componentDidMount() {
        RequestModule.getUserObject(this.props.login).then(object => {
            this.setState({
                userObject: object,
                loaded: true
            });
        });
    }

    render() {
        let {userObject, loaded} = this.state;
        return (
            <div>
                <Modal
                    open={this.props.visible}
                    style={{
                        marginTop: '0 !important',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}
                    closeIcon={true}
                    onClose={this.props.onClose_cb}
                >
                    <Modal.Header>
                        <Header as='h2'>
                            <Image wrapped={true} size='huge' src={userObject.avatar_url}/>
                            <Header.Content>
                                {userObject.name}
                                <Header.Subheader>
                                    {userObject.bio}
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Modal.Header>

                    <Modal.Content>
                        {loaded ?
                            <Modal.Description>
                                <Table definition={true}>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>login</Table.Cell>
                                            <Table.Cell>{userObject.login}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>email</Table.Cell>
                                            <Table.Cell>{userObject.email}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>location</Table.Cell>
                                            <Table.Cell>{userObject.location}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>company</Table.Cell>
                                            <Table.Cell>{userObject.company}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Public repos</Table.Cell>
                                            <Table.Cell>{userObject.public_repos}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Followers</Table.Cell>
                                            <Table.Cell>{userObject.followers}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Following</Table.Cell>
                                            <Table.Cell>{userObject.following}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Modal.Description>
                            : <Dimmer active={!loaded}>
                                <Loader/>
                            </Dimmer>
                        }
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default UserModal;