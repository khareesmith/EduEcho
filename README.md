# VoiceRAGTutor: Your Interactive Voice-Based Learning Assistant

## Overview
VoiceRAGTutor is a voice-first education platform designed to help middle and high school students excel in STEM subjects. Using Azure OpenAI GPT-4o Realtime, it combines natural conversational interfaces with powerful Retrieval-Augmented Generation (RAG) to deliver personalized, step-by-step explanations and answers to academic queries.

Students can ask questions like:

- "What is Newton's second law of motion?"
- "How do I solve a quadratic equation?" 
- "Explain photosynthesis in simple terms."

## Features
- **Interactive Voice Tutoring**: Engage in natural, conversational learning with voice inputs and outputs.
- **Step-by-Step Problem Solving**: Break down complex topics into manageable explanations.
- **Personalized Learning**: Adapt explanations to the student's grade level and subject proficiency.
- **Real-Time Citations**: Show references and sources for all responses to ensure credibility.
- **Multi-Subject Support**: Covers topics in math, science, and more.
- **RAG (Retrieval Augmented Generation)**: The app uses the Azure AI Search service to answer questions about a knowledge base, and sends the retrieved documents to the GPT-4o Realtime API to generate a response.

## Architecture
The application leverages the following Azure services:

- **Azure OpenAI GPT-4o Realtime API**: Processes voice input and generates conversational responses.
- **Azure AI Search**: Retrieves relevant educational content from indexed textbooks, guides, and academic resources.
- **Azure Cognitive Services (Speech)**: Handles voice-to-text and text-to-speech for a seamless voice experience.
- **Azure Storage**: Stores user progress and preferences.


This will be expanded more in the future..