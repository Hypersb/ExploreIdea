import torch
import clip
from PIL import Image
import numpy as np
from typing import List, Tuple
import io
import requests
import os


class CLIPService:
    """
    Service for handling CLIP model operations including:
    - Text encoding
    - Image encoding
    - Similarity computation
    """
    
    def __init__(self):
        self.model_name = os.getenv("CLIP_MODEL_NAME", "ViT-B/32")
        self.device = os.getenv("DEVICE", "cpu")
        
        # Load CLIP model
        print(f"Loading CLIP model: {self.model_name}")
        self.model, self.preprocess = clip.load(self.model_name, device=self.device)
        self.model.eval()
        
        print(f"✅ CLIP model loaded on {self.device}")
    
    def encode_text(self, text: str) -> np.ndarray:
        """
        Encode text query into embedding vector
        
        Args:
            text: Input text query
            
        Returns:
            Normalized embedding vector
        """
        try:
            # Tokenize text
            text_tokens = clip.tokenize([text]).to(self.device)
            
            # Get text features
            with torch.no_grad():
                text_features = self.model.encode_text(text_tokens)
                text_features /= text_features.norm(dim=-1, keepdim=True)
            
            # Convert to numpy
            return text_features.cpu().numpy()[0]
        
        except Exception as e:
            print(f"Error encoding text: {e}")
            raise
    
    def encode_image_from_url(self, image_url: str) -> np.ndarray:
        """
        Encode image from URL into embedding vector
        
        Args:
            image_url: URL of the image
            
        Returns:
            Normalized embedding vector
        """
        try:
            # Download image
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            
            # Load and preprocess image
            image = Image.open(io.BytesIO(response.content)).convert("RGB")
            image_input = self.preprocess(image).unsqueeze(0).to(self.device)
            
            # Get image features
            with torch.no_grad():
                image_features = self.model.encode_image(image_input)
                image_features /= image_features.norm(dim=-1, keepdim=True)
            
            # Convert to numpy
            return image_features.cpu().numpy()[0]
        
        except Exception as e:
            print(f"Error encoding image: {e}")
            raise
    
    def encode_image_from_bytes(self, image_bytes: bytes) -> np.ndarray:
        """
        Encode image from bytes into embedding vector
        
        Args:
            image_bytes: Image data in bytes
            
        Returns:
            Normalized embedding vector
        """
        try:
            # Load and preprocess image
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image_input = self.preprocess(image).unsqueeze(0).to(self.device)
            
            # Get image features
            with torch.no_grad():
                image_features = self.model.encode_image(image_input)
                image_features /= image_features.norm(dim=-1, keepdim=True)
            
            # Convert to numpy
            return image_features.cpu().numpy()[0]
        
        except Exception as e:
            print(f"Error encoding image from bytes: {e}")
            raise
    
    def compute_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Compute cosine similarity between two embeddings
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            Similarity score (0-1)
        """
        # Cosine similarity
        similarity = np.dot(embedding1, embedding2)
        
        # Normalize to 0-1 range
        similarity = (similarity + 1) / 2
        
        return float(similarity)
    
    def rank_images(
        self, 
        query_embedding: np.ndarray, 
        image_embeddings: List[np.ndarray]
    ) -> List[Tuple[int, float]]:
        """
        Rank images by similarity to query
        
        Args:
            query_embedding: Query embedding vector
            image_embeddings: List of image embedding vectors
            
        Returns:
            List of (index, similarity_score) tuples, sorted by score
        """
        similarities = []
        
        for idx, img_embedding in enumerate(image_embeddings):
            similarity = self.compute_similarity(query_embedding, img_embedding)
            similarities.append((idx, similarity))
        
        # Sort by similarity (descending)
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        return similarities
    
    def batch_encode_text(self, texts: List[str]) -> List[np.ndarray]:
        """
        Encode multiple text queries in batch
        
        Args:
            texts: List of text queries
            
        Returns:
            List of embedding vectors
        """
        try:
            # Tokenize all texts
            text_tokens = clip.tokenize(texts).to(self.device)
            
            # Get text features
            with torch.no_grad():
                text_features = self.model.encode_text(text_tokens)
                text_features /= text_features.norm(dim=-1, keepdim=True)
            
            # Convert to list of numpy arrays
            return [feat.cpu().numpy() for feat in text_features]
        
        except Exception as e:
            print(f"Error in batch encoding: {e}")
            raise
