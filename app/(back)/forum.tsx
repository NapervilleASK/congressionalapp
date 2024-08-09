import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal, Portal } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

interface PostType {
  id: number;
  title: string;
  content: string;
  comments: string[];
  likes: number;
  hasLiked: boolean;
  isSaved: boolean;
}

const InputField: React.FC<{ value: string; onChangeText: (text: string) => void; placeholder: string; style?: object }> = ({ value, onChangeText, placeholder, style }) => (
  <TextInput
    style={[styles.input, style]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="gray"
  />
);

const Post: React.FC<{
  post: PostType;
  onAddComment: (postId: number, comment: string) => void;
  onLike: (postId: number) => void;
  onSave: (postId: number) => void;
  hasLiked: boolean;
  isSaved: boolean;
  isExpanded: boolean;
  onPress: () => void;
}> = ({ post, onAddComment, onLike, onSave, hasLiked, isSaved, isExpanded, onPress }) => {
  const [newComment, setNewComment] = useState('');
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={[styles.post, isExpanded && styles.expandedPost]}>
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
              <TouchableOpacity style={styles.commentButton}>
                <Icon name="comment" size={24} color="#D3D3D3" />
                <Text style={styles.commentCount}>{post.comments.length}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.fullScreenModal}>
          {/* Overlay Box */}
          <View style={styles.overlayBox} />

          <View style={styles.fullScreenContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Icon name="close" size={30} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.fullScreenTitle}>{post.title}</Text>
            <Text style={styles.fullScreenContent}>{post.content}</Text>

            <FlatList
              data={post.comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.comment}>{item}</Text>}
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
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [viewSavedPosts, setViewSavedPosts] = useState(false);

  const handleAddPost = () => {
    if (newPost.trim() && newDescription.trim()) {
      const newPostObject: PostType = {
        id: posts.length + 1,
        title: newPost,
        content: newDescription,
        comments: [],
        likes: 0,
        hasLiked: false,
        isSaved: false,
      };
      setPosts([newPostObject, ...posts]); // Add new posts to the beginning
      setNewPost('');
      setNewDescription('');
      setShowInput(false);
    } else {
      alert('Please enter both title and description');
    }
  };

  const handleAddComment = (postId: number, comment: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.hasLiked ? post.likes - 1 : post.likes + 1, hasLiked: !post.hasLiked }
        : post
    ));
  };

  const handleSave = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handlePressPost = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
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
            isExpanded={item.id === expandedPostId}
            onPress={() => handlePressPost(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity style={styles.bookmarkButton} onPress={handleViewSavedPosts}>
        <Icon name="bookmark" size={30} color={viewSavedPosts ? 'green' : 'blue'} />
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
    backgroundColor: '#000000', // Main background color
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  inputContainerTop: {
    backgroundColor: '#35374f',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10, // Added margin to separate input area from posts
  },
  post: {
    backgroundColor: '#35374f',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#4F515B',
    borderWidth: 1,
  },
  expandedPost: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  postContent: {
    fontSize: 16,
    marginTop: 10,
    color: '#D3D3D3',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  likeAndSaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  likeCount: {
    color: '#D3D3D3',
    marginLeft: 5,
  },
  saveCount: {
    color: '#D3D3D3',
    marginLeft: 5,
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    color: '#D3D3D3',
    marginLeft: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    marginRight: 10,
    color: 'white', // Updated to white
  },
  input: {
    height: 40,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'white', // Updated to white
  },
  smallSubmitButton: {
    backgroundColor: '#4F515B',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleInput: {
    marginBottom: 10,
    color: 'white', // Updated to white
  },
  descriptionInput: {
    marginBottom: 10,
    color: 'white', // Updated to white
  },
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
  },
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
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1, // Ensure the close button is above other elements
  },
  fullScreenModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    flex: 1,
    justifyContent: 'center',
  },
  overlayBox: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 0, // Ensure the overlay is below content
  },
  fullScreenContainer: {
    flex: 1,
    padding: 20,
  },
  fullScreenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  fullScreenContent: {
    fontSize: 18,
    color: '#D3D3D3',
    marginBottom: 20,
  },
  commentsContainer: {
    flex: 1,
    marginTop: 10,
  },
  comment: {
    fontSize: 16,
    color: '#D3D3D3',
    marginBottom: 10,
    backgroundColor: '#35374f',
    padding: 10,
    borderRadius: 5,
  },
});

export default Forum;
