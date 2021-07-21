import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_MEDIA } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeMediaId } from '../utils/localStorage';

const SavedMedia = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeMedia, { error }] = useMutation(REMOVE_MEDIA);

  const userData = data?.me || {};

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;


  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteMedia = async (mediaId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeMedia({
        variables: { mediaId },
      });
      
      // upon success, remove media's id from localStorage
      removeMediaId(mediaId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing {userData.username}'s Library!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
        {userData.savedMedia?.length
            ? `Viewing Library:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedMedia?.map((media) => {
            return (
              <Card key={media.mediaId} border='dark'>
                {media.image ? (
                  <Card.Img src={media.image} alt={`The cover for ${media.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{media.title}</Card.Title>
                  <Card.Text>{media.description}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteMedia(media.mediaId)}>
                    Remove from library!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedMedia;
