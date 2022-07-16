import { View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react'
import theme from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../core/firebase';
import { GlobalStyles, Nunito_400Regular, Nunito_700Bold } from "../styles/GlobalStyles";
import { useFonts } from 'expo-font';
import moment from 'moment';

const likeIcon = <Icon name="heart" size={25} color={theme.SECONDARY_COLOR} />
const disLikedIcon = <Icon name="heart-o" size={25} color={theme.SECONDARY_COLOR} />

// const likeIcon = <Icon name="star" size={25} color={theme.SECONDARY_COLOR} />
// const disLikedIcon = <Icon name="star-o" size={25} color={theme.SECONDARY_COLOR} />

const CommentIcon = <Icon name="comment-o" size={25} color={theme.SECONDARY_COLOR} />
// const CommentIcon = <Icon name="pencil" size={25} color={theme.SECONDARY_COLOR} />

const PostCard = ({ item, navigation }) => {
    const [userData, setUserData] = useState(null);
    const [like, setLike] = useState(false);
    const [commentCnt, setCommentsCnt] = useState(0);

    const handleLike = () => {
        like ? setLike(false) : setLike(true);
    }

    const getNumberOfComment = () => {
        const postId = item.id;
        try{
            db.collection('comments')
            .where('postId', '==', postId)
            .get()
            .then((querySnapshot) => {
                setCommentsCnt(querySnapshot.size);
            });
        }
        catch(e){
            console.log(e);
        }
    }

    const getUser = async () => {
        await db.collection('users')
        .doc(item.userId)
        .get()
        .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
                setUserData(documentSnapshot.data());
            }
        })
        .catch(function(err) {
            console.log('error: ', err);
        });
    }

    const PostHeader = () => {
        return(
            <View style={styles.postHeader}>
                <Image 
                    style={styles.userPic} 
                    source={{
                        uri: userData
                          ? userData.userImg ||
                            'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                          : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                      }}
                    />
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile', {userId: userData.userId})}>
                        <Text style={styles.headerTitle}>
                            {userData ? userData.username : ''}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.headerSubTitle}>
                        { moment(item.postTime.toDate()).fromNow() }
                    </Text>
                </View>
            </View>
        );
    };

    const PostCaption = () => {
        return(
            <View style={styles.caption}>
                <Text style={styles.capText}>{item.post}</Text>
            </View>
        );
    }
    
    const PostImage = () => {
        return(
            <View>
                {item.postImg != null ? <Image style={styles.PostImage} source={{uri: item.postImg}} /> : <View style={styles.divider} />}
            </View>
        );
    }
    
    const LikesArea = () => {
        return(
            <View style={styles.likesArea}>
                <View style={styles.likes}>
                    <TouchableOpacity onPress={handleLike}>
                        <Text style={styles.likesText}>
                            { like ? likeIcon : disLikedIcon }
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.likesText}>0</Text>
                </View>
                <View style={styles.comments}>
                    <TouchableOpacity 
                        onPress={() => {
                            navigation.navigate('Comments',
                            { postId: item.id, userId: item.userId }
                            );
                        }}>
                        <Text style={styles.likesText}>{CommentIcon}</Text> 
                    </TouchableOpacity>
                    <Text style={styles.likesText}>{commentCnt}</Text>
                </View> 
            </View>
        );
    }
    
    const Comments = () => {
        return(
            <View style={styles.comBubble}>
                <Image style={styles.comImage} source={require('../assets/images/pp1.jpg')}/>
                <Text style={styles.comText}>
                    <Text style={{color: theme.SECONDARY_COLOR, fontWeight: 'bold',}}>
                        John Doe 
                    </Text> 
                    {' '} Deeply in thought about all life. 
                </Text>
            </View>
        );
    }

    useEffect(() => {
        getUser();
        getNumberOfComment();
    }, []);

  return (
    <View style={styles.post}>
        <View style={styles.postHeader}>
            <PostHeader/>
        </View>
        <PostCaption/>
        <PostImage/>
        <LikesArea/>
        {/* <Comments/>
        <Comments/> */}
        {/* <TouchableOpacity style={styles.btn}>
            <Text 
                style={{fontSize: 14, fontFamily: 'Nunito_700Bold', color: theme.SECONDARY_COLOR}}>
                    view more
            </Text>
        </TouchableOpacity> */}
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: '#DBDBD9',
    },
    post: {
        marginBottom: 5,
        margin: 5,
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#FFF',
        // backgroundColor: 'purple',
    },
    postHeader: {
        flexDirection: 'row',
        borderRadius: 8,
    },

    userPic: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight:  10,
    },
    headerTitle: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 16,
        color: theme.SECONDARY_COLOR,
    },
    headerSubTitle: {
        fontFamily: 'Nunito_400Regular',
        color: theme.TEXT_COLOR,
        fontSize: 10,
    },
    caption: {
        marginTop: 5,
    },
    capText: {
        fontFamily: 'Nunito_400Regular',
    },
    PostImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 10,
    },
    likesArea: {
        marginTop: 5,
        flexDirection: 'row',
    },
    likesText: {
        marginRight: 8,
        fontFamily: 'Nunito_400Regular',
    },
    comBubble: {
        backgroundColor: '#E6F1E7',
        borderRadius: 10,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    }, 
    comText: {
        fontFamily: 'Nunito_700Bold',
        color: '#888888',
    },
    comImage: {
        width: 30,
        height: 30,
        borderRadius: 10,
        marginRight: 8,
    },
    likes: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    comments: {
        flexDirection: 'row',
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        width: 80,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 5,
        paddingRight: 5,
        marginHorizontal: '40%',
        alignItems: 'center',
    },
    divider: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        width: '92%',
        alignSelf: 'center',
        marginTop: 15,
    }
});