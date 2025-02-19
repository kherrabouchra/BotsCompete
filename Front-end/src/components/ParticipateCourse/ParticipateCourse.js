import React, { useState, useEffect } from "react";
import {
  Banner,
  Container,
  PinkBtn,
  TextSub,
  WhiteBtn,
} from "../Global/GlobalComponents"; 
import { CourseTitle, TextWrapper } from "../Course/Details/CourseElements";
import { FilterBtnWrapper } from "../Course/Courses/LearnElements";
import {
  CloudinaryVideoContainer,
  CsvLink,
  LessonTitle,
  NextButton,
  QuizAnswer,
  QuizContainer,
  VideoFrame,
  VideoWndw,
} from "./styles";
import CodeEditor from "./CodeEditor";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import Quiz from "./Quiz";
import { MdArrowCircleRight, MdArrowForward } from "react-icons/md";

import { Group, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';



 


const ParticipateCourse = ({ log }) => {
  const [lesson, setLesson] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctOptionLabel, setCorrectOptionLabel] = useState("");
  const[all,setAll]=useState([]);
  const loc = useLocation();
  const user = loc.state.user;
  const course= loc.state.course;
console.log(user, course, loc.state);





  const handleCorrectAnswer = (selectedOption) => {
    if (lesson.correct_answer === selectedOption) {
      console.log("Correct");
      setCorrect(true);
    } else {
      console.log("False");
      setCorrect(false);
      setShowCorrectAnswer(true);

      const correctOptionLabel = lesson[`option_${lesson.correct_answer}`];
      if (correctOptionLabel) {
        setCorrectOptionLabel(correctOptionLabel);
      }
    }
  };

  const addPoints = async () => {
    try {
      const data = {
        devID: user.userID,
        points: lesson.points,
      };
       
      notifications.show({
        title: `+ ${lesson.points} XP POINTS`,
        message: ' Great, keep it up !' , color:'grape'
      })
      const pointsAdded = await api.put(`user/addPoints/${user.userID}`, data);

      console.log(pointsAdded.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSubmission = (e) => {
    e.preventDefault()
    setSubmitted(true);

    if (correct) {
      addPoints();

    }
  };

  const handleClick = (e) => {
    e.preventDefault()
   
    setTimeout(() => {
    navigate(`/Dashboard/courses/lesson/${parseInt(id) + 1}`, { state:{ user:user , course:course}});
      
    }, 700);
  }; 

  const fetchLesson = async () => {

    try {
      const response = await api.get(`/courses/lessons/get/${id}`);
      if (response.status === 200) {
        setLesson(response.data.data);
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }; 



  
  useEffect(() => {
   
 api.get(`/courses/lessons/getAll/course/${course.courseID}`)
    .then((res)=>{console.log(res.data);
      setAll(res.data.data)
     
      
    }).catch((err=>console.log(err)))

 
   


 
    fetchLesson();
  }, [ ]);

  useEffect(()=>{
    if(all.length>0){

      console.log( id ,all[0].id);
                if ( id == all[0]?.id){
                  api.post('/courses/enrolled', {developer:user.userID, course:course.courseID})
                  .then((res)=>{console.log(res.data);
                    if(res.data.status==='success'){
                      console.log('enrolled !!');
                    }
                  }).catch((err)=>console.log(err))
                  
                  
                }
      
            }
  },[all])
 
  let bannercolor =
    "linear-gradient(299.49deg, #000000 12.93%, #4335EE 27.28%, #C78AFB 69.39%)";
  return (
    <div>
      <Banner color="black" style={{ height: "270px" }}>
        <TextWrapper>
       <div style={{color:"#F989E6" ,display:'flex'}}>
       <MdArrowForward size={36}/><LessonTitle style={{ fontWeight:300,}} >{lesson.chapterName}</LessonTitle>

        </div>
        </TextWrapper>
      </Banner>
      {lesson.videoUrl && !lesson.quizID && !lesson.notebookURL && (
        <Container style={{padding:"30px", background:'black', color:'white', borderRadius:0}}>
             <CourseTitle style={{marginLeft:"100px",fontSize:"60px", marginTop:'-80px'}} color={"white"} title={lesson.lessonName} />
             <Group position="center">
       
    </Group>
          <CloudinaryVideoContainer cloudName="dub9jmuyb">
            <VideoWndw
              publicId={lesson.videoUrl}
              controls
              width="100%"
              height="auto"
              style={{ margin: "15px 23%", width: "60%" }}
            />
          </CloudinaryVideoContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Link 
              onClick={(e)=>handleClick(e)}
            
            >
              <NextButton onClick={addPoints}>Got it<MdArrowForward/></NextButton>
            </Link>
          </div>
        </Container>
      )}
      {!lesson.videoUrl && (
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between", alignItems:"center", flexDirection:'column', width:"100vw"
            }}
          >
            <QuizContainer>
            <CourseTitle style={{ width:'70vw', margin: "0 40px 30px -250px ", fontSize:"60px", padding:0}} color={"black"} title={lesson.lessonName} />

              <Quiz
                lesson={lesson}
                correct={correct}
                submitted={submitted}
                handleCorrectAnswer={handleCorrectAnswer}
                handleSubmission={handleSubmission}
                showCorrectAnswer={showCorrectAnswer}
                correctOptionLabel={correctOptionLabel}
                addPoints={addPoints}
                user={user}
              />
            </QuizContainer>
           {lesson.notebookURL &&  <CodeEditor lesson={lesson} />}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {!submitted && (
              <WhiteBtn onClick={(e) => handleSubmission(e)}>
                Submit answer
              </WhiteBtn>
            )}
          </div>
        </Container>
      )}
      {lesson.videoUrl && lesson.quizID && (
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <QuizContainer>
              <LessonTitle>{lesson.lessonName}</LessonTitle>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CloudinaryVideoContainer cloudName="dub9jmuyb">
                  <VideoWndw
                    publicId={lesson.videoUrl}
                    controls
                    width="75%"
                    height="auto"
                    style={{ margin: "15px 4%", width: "100%" }}
                  />
                </CloudinaryVideoContainer>
                <div>
                  <Quiz
                    lesson={lesson}
                    correct={correct}
                    submitted={submitted}
                    handleCorrectAnswer={handleCorrectAnswer}
                    handleSubmission={handleSubmission}
                    showCorrectAnswer={showCorrectAnswer}
                    correctOptionLabel={correctOptionLabel}
                    fetchLesson={fetchLesson}
                    handleClick={handleClick}
                  />
                </div>
              </div>
            </QuizContainer>
            <CodeEditor lesson={lesson} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {/* <Link
          to={`/Dashboard/courses/lesson/${parseInt(id) + 1}`}
          onClick={handleClick}
          state={user}
        > */}
            <NextButton>Submit answer</NextButton>
            {/* </Link> */}
          </div>
        </Container>
      )}
      {lesson.videoUrl && !lesson.quizID && lesson.notebookURL && (
        <Container>
          <LessonTitle>{lesson.lessonName}</LessonTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CloudinaryVideoContainer cloudName="dub9jmuyb">
                <VideoWndw
                  publicId={lesson.videoUrl}
                  controls
                  width="75%"
                  height="auto"
                  style={{ margin: "20px 8%", width: "280%" }}
                />
              </CloudinaryVideoContainer>
              {lesson.csvUrl && (
                <div style={{ margin: "15px 50px" }}>
                  <CsvLink
                    href={lesson.csvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download dataset
                  </CsvLink>
                </div>
              )}
            </div>
            <CodeEditor lesson={lesson} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Link 
              onClick={(e)=>handleClick(e)} 
            >
              <PinkBtn onClick={addPoints}>Got it <MdArrowCircleRight/></PinkBtn>
            </Link>
          </div>
        </Container>
      )}
    </div>
  );
};

export default ParticipateCourse;

/* 
import React, { useState, useEffect } from "react";
import {
  Banner,
  Container,
  P,
  SubHeader,
  TextSub,
  WhiteBtn,
} from "../Global/GlobalComponents";
import { CourseTitle, TextWrapper } from "../Course/Details/CourseElements";
import { FilterBtnWrapper } from "../Course/Courses/LearnElements";
import {
  CloudinaryVideoContainer,
  CsvLink,
  LessonTitle,
  QuizAnswer,
  QuizContainer,
  VideoFrame,
  VideoWndw,
} from "./styles";
import { PurpleBtn } from "../Global/GlobalComponents";
import CodeEditor from "./CodeEditor";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import Quiz from "./Quiz";
import { Points } from "../Dashboard/DashboardElements";
import { Xppoint } from "../Dashboard/DashboardElements";
const ParticipateCourse = () => {
  const [lesson, setLesson] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctOptionLabel, setCorrectOptionLabel] = useState("");
  const loc = useLocation();
  const user = loc.state;

  console.log(user);
  const handleCorrectAnswer = (selectedOption) => {
    if (lesson.correct_answer === selectedOption) {
      console.log("Correct");
      setCorrect(true);
    } else {
      console.log("False");
      setCorrect(false);
      setShowCorrectAnswer(true);

      const correctOptionLabel = lesson[`option_${lesson.correct_answer}`];
      if (correctOptionLabel) {
        setCorrectOptionLabel(correctOptionLabel);
      }
    }
  };

  const handleSubmission = () => {
    setSubmitted(true);
  };

  const fetchLesson = async () => {
    try {
      const response = await api.get(`courses/lessons/get/${id}`);
      if (response.data.status === "success") {
        setLesson(response.data.data);
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleClick = () => {
    navigate(`/Dashboard/courses/lesson/${parseInt(id) + 1}`, { state: user });
  };

  useEffect(() => {
    fetchLesson();
  }, []);

  console.log(lesson);

  let bannercolor =
    "linear-gradient(299.49deg, #000000 12.93%, #4335EE 27.28%, #C78AFB 69.39%)";
  return (
    <div style={lesson.videoUrl ? { color: "white", background: "black" } : {}}>
      <div style={{ background: "black", height: "30px" }}></div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-evenly",
        }}
      >
        <TextWrapper style={{ marginLeft: "10px" }}>
          <h2>Chapter: {lesson.chapterName}</h2>

          <CourseTitle
            color={lesson.videoUrl ? "white" : "black"}
            title={lesson.lessonName}
          />
        </TextWrapper>

        <div style={{ margin: " 20px " }}>
          <p style={{ padding: " 20px 0" }}>
            Lesson {lesson.id} / {lesson.length}
          </p>
          <Points
            style={{
              background: "#F989E6",
              width: "140px",
              padding: "5px",
              borderRadius: "15px",
            }}
          >
            <img
              style={{ width: "45px" }}
              src="../images/xppoint.png"
              alt="coin"
            />
            <h3>{lesson.points}XP</h3>
          </Points>
        </div>
      </div>
      {lesson.videoUrl && !lesson.quizID && !lesson.notebookURL && (
        <div>
          <CloudinaryVideoContainer cloudName="dub9jmuyb">
            <VideoWndw
              publicId={lesson.videoUrl}
              controls
              width="75%"
              height="auto"
            />
          </CloudinaryVideoContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          ></div>
        </div>
      )}
      <div style={{ padding: "70px" }}>
        {!lesson.videoUrl && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <QuizContainer>
                <LessonTitle>{lesson.lessonName}</LessonTitle>
                <Quiz
                  lesson={lesson}
                  correct={correct}
                  submitted={submitted}
                  handleCorrectAnswer={handleCorrectAnswer}
                  handleSubmission={handleSubmission}
                  showCorrectAnswer={showCorrectAnswer}
                  correctOptionLabel={correctOptionLabel}
                />
              </QuizContainer>
              <CodeEditor lesson={lesson} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            ></div>{" "}
          </>
        )}
        {lesson.videoUrl && lesson.quizID && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <QuizContainer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CloudinaryVideoContainer cloudName="dub9jmuyb">
                    <VideoWndw
                      publicId={lesson.videoUrl}
                      controls
                      width="75%"
                      height="auto"
                      style={{ margin: "15px 4%", width: "100%" }}
                    />
                  </CloudinaryVideoContainer>
                  <div>
                    <Quiz lesson={lesson} />
                  </div>
                </div>
              </QuizContainer>
              <CodeEditor lesson={lesson} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            ></div>
          </>
        )}
        {lesson.videoUrl && !lesson.quizID && lesson.notebookURL && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CloudinaryVideoContainer cloudName="dub9jmuyb">
                  <VideoWndw
                    publicId={lesson.videoUrl}
                    controls
                    width="75%"
                    height="auto"
                    style={{ margin: "20px 8%", width: "280%" }}
                  />
                </CloudinaryVideoContainer>
                {lesson.csvUrl && (
                  <div style={{ margin: "15px 50px" }}>
                    <CsvLink
                      href={lesson.csvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download dataset
                    </CsvLink>
                  </div>
                )}
              </div>
              <CodeEditor lesson={lesson} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            ></div>
          </>
        )}
        <Link
          to={`/Dashboard/courses/lesson/${parseInt(id) + 1}`}
          onClick={handleClick}
          state={user}
        >
          <PurpleBtn
            style={{ marginLeft: "80%", width: "10%" }}
            onClick={!submitted ? () => handleSubmission() : handleClick}
          >
            {" "}
            {lesson.videoUrl && !lesson.quizID ? "Got it !" : "Submit answer"}
          </PurpleBtn>
        </Link>
      </div>
    </div>
  );
};

export default ParticipateCourse;
 */
