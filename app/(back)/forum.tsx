import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal, Portal } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

interface Comment {
  comment: string;
}

interface PostType {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
  likes: number;
  hasLiked: boolean;
  isSaved: boolean;
}

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: StyleProp<TextStyle>;
}

interface PostProps {
  post: PostType;
  onAddComment: (postId: number, comment: string) => void;
  onLike: (postId: number) => void;
  onSave: (postId: number) => void;
  hasLiked: boolean;
  isSaved: boolean;
  onPress: () => void;
}

const InputField: React.FC<InputFieldProps> = ({ value, onChangeText, placeholder, style }) => (
  <TextInput
    style={[styles.input, style]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="gray"
  />
);

const Post: React.FC<PostProps> = ({ post, onAddComment, onLike, onSave, hasLiked, isSaved, onPress }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.post}>
      <TouchableWithoutFeedback onPress={showModal}>
        <View>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>

          <View style={styles.actionContainer}>
            <View style={styles.likeAndSaveContainer}>
              <TouchableOpacity onPress={() => onLike(post.id)} style={styles.actionButton}>
                <Icon name={hasLiked ? 'favorite' : 'favorite-border'} size={24} color={hasLiked ? 'red' : 'gray'} />
                <Text style={styles.likeCount}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onSave(post.id)} style={styles.actionButton}>
                <Icon name={isSaved ? 'bookmark' : 'bookmark-border'} size={24} color={isSaved ? 'green' : 'gray'} />
                <Text style={styles.saveCount}>{isSaved ? 'Saved' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.commentSection}>
              <TouchableOpacity style={styles.commentButton} onPress={showModal}>
                <Icon name="comment" size={24} color="#D3D3D3" />
                <Text style={styles.commentCount}>{post.comments.length}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.fullScreenModal}>
          <View style={styles.overlayBox} />
          <ScrollView contentContainerStyle={styles.fullScreenContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Icon name="close" size={30} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.fullScreenTitle}>{post.title}</Text>
            <Text style={styles.fullScreenContent}>{post.content}</Text>

            <FlatList
              data={post.comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.comment}>{item.comment}</Text>}
              showsVerticalScrollIndicator={false}
              style={styles.commentsContainer}
            />

            <View style={styles.commentInputContainer}>
              <InputField
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment"
                style={styles.commentInput}
              />
              <TouchableOpacity 
                style={styles.smallSubmitButton} 
                onPress={() => {
                  if (newComment.trim()) {
                    onAddComment(post.id, newComment);
                    setNewComment('');
                  }
                }}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPost, setNewPost] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const [viewSavedPosts, setViewSavedPosts] = useState<boolean>(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPost = async () => {
    if (newPost.trim() && newDescription.trim()) {
      const newPostObject = {
        id: Date.now(), // Use a unique ID, e.g., timestamp or UUID
        title: newPost,
        content: newDescription,
        comments: [],
        likes: 0,
        hasLiked: false,
        isSaved: false,
      };
      try {
        await axios.post('http://localhost:3000/posts', newPostObject);
        fetchPosts();
        setNewPost('');
        setNewDescription('');
        setShowInput(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please enter both title and description');
    }
  };

  const handleAddComment = async (postId: number, comment: string) => {
    if (comment.trim()) {
      try {
        await axios.post('http://localhost:3000/comment', { id: postId, comment });
        fetchPosts();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Comment cannot be empty');
    }
  };

  const handleLike = async (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          // Prevent multiple likes
          if (post.hasLiked) {
            return post;
          }

          // Toggle like and update the likes count
          return {
            ...post,
            hasLiked: true,
            likes: post.likes + 1,
          };
        }
        return post;
      })
    );

    try {
      await axios.post('http://localhost:3000/like', { id: postId });
      fetchPosts(); // Optional: to ensure the state is in sync with the server
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (postId: number) => {
    // Assuming you want to handle saving posts in the UI rather than a server call
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, isSaved: !post.isSaved } : post
    ));
  };

  const handleViewSavedPosts = () => {
    setViewSavedPosts(!viewSavedPosts);
  };

  return (
    <View style={styles.container}>
      {showInput && (
        <View style={styles.inputContainerTop}>
          <InputField 
            value={newPost} 
            onChangeText={setNewPost} 
            placeholder="Post Title" 
            style={styles.titleInput} 
          />
          <InputField 
            value={newDescription} 
            onChangeText={setNewDescription} 
            placeholder="Post Description" 
            style={styles.descriptionInput} 
          />
          <TouchableOpacity style={styles.smallSubmitButton} onPress={handleAddPost}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={viewSavedPosts ? posts.filter(post => post.isSaved) : posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Post
            post={item}
            onAddComment={handleAddComment}
            onLike={() => handleLike(item.id)}
            onSave={() => handleSave(item.id)}
            hasLiked={item.hasLiked}
            isSaved={item.isSaved}
            onPress={() => {}} // Removed post click handling since it opens modal
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity style={styles.bookmarkButton} onPress={handleViewSavedPosts}>
        <Icon name="bookmark" size={30} color={viewSavedPosts ? 'green' : '#083248'} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatingButton} onPress={() => setShowInput(!showInput)}>
        <Icon name="add" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 40,
    paddingHorizontal: 10,
  } as ViewStyle,
  inputContainerTop: {
    backgroundColor: '#35374f',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  } as ViewStyle,
  post: {
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#4F515B',
    borderWidth: 1,
  } as ViewStyle,
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  } as TextStyle,
  postContent: {
    fontSize: 16,
    marginTop: 10,
    color: '#D3D3D3',
  } as TextStyle,
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  } as ViewStyle,
  likeAndSaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  } as ViewStyle,
  likeCount: {
    color: '#D3D3D3',
    marginLeft: 5,
  } as TextStyle,
  saveCount: {
    color: '#D3D3D3',
    marginLeft: 5,
  } as TextStyle,
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  commentCount: {
    color: '#D3D3D3',
    marginLeft: 5,
  } as TextStyle,
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  } as ViewStyle,
  commentInput: {
    flex: 1,
    marginRight: 10,
    color: 'white',
  } as TextStyle,
  input: {
    height: 40,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'white',
  } as TextStyle,
  smallSubmitButton: {
    backgroundColor: '#4F515B',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  } as ViewStyle,
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  } as TextStyle,
  titleInput: {
    marginBottom: 10,
    color: 'white',
  } as TextStyle,
  descriptionInput: {
    marginBottom: 10,
    color: 'white',
  } as TextStyle,
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#8CDBA9',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  } as ViewStyle,
  bookmarkButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: '#4F515B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  } as ViewStyle,
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  } as ViewStyle,
  fullScreenModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  overlayBox: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 0,
  } as ViewStyle,
  fullScreenContainer: {
    flexGrow: 1,
    padding: 20,
    maxHeight: height * 0.85,
  } as ViewStyle,
  fullScreenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  } as TextStyle,
  fullScreenContent: {
    fontSize: 18,
    color: '#D3D3D3',
    marginBottom: 20,
  } as TextStyle,
  commentsContainer: {
    flex: 1,
    marginTop: 10,
  } as ViewStyle,
  comment: {
    fontSize: 16,
    color: '#D3D3D3',
    marginBottom: 10,
    backgroundColor: '#35374f',
    padding: 10,
    borderRadius: 5,
  } as TextStyle,
});

export default Forum;
