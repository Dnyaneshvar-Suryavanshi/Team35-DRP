package com.cdac.RationSahayata.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.cdac.RationSahayata.dto.*;

@org.springframework.web.bind.annotation.RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<ErrorResponseDto> handleDuplicateResource(DuplicateResourceException ex) {
		ErrorResponseDto error = ErrorResponseDto.builder()
				.message(ex.getMessage())
				.status(HttpStatus.BAD_REQUEST.value())
				.timestamp(LocalDateTime.now())
				.build();
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);

	}

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ErrorResponseDto> handleUnauthorized(UnauthorizedException ex) {
		ErrorResponseDto error = ErrorResponseDto.builder()
				.message(ex.getMessage())
				.status(HttpStatus.UNAUTHORIZED.value())
				.timestamp(LocalDateTime.now())
				.build();
		return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponseDto> handleGlobalException(Exception ex) {
		ErrorResponseDto error = ErrorResponseDto.builder()
				.message("An error occurred: " + ex.getMessage())
				.status(HttpStatus.INTERNAL_SERVER_ERROR.value())
				.timestamp(LocalDateTime.now())
				.build();
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponseDto> handleResourceNotFound(ResourceNotFoundException ex) {
		ErrorResponseDto error = ErrorResponseDto.builder()
				.message(ex.getMessage())
				.status(HttpStatus.NOT_FOUND.value())
				.timestamp(LocalDateTime.now())
				.build();
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

}
