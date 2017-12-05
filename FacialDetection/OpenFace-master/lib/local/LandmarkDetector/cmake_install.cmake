# Install script for directory: /Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "RELEASE")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/libLandmarkDetector.a")
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libLandmarkDetector.a" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libLandmarkDetector.a")
    execute_process(COMMAND "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ranlib" "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libLandmarkDetector.a")
  endif()
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/OpenFace" TYPE FILE FILES
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/CCNF_patch_expert.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/LandmarkCoreIncludes.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/LandmarkDetectionValidator.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/LandmarkDetectorFunc.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/LandmarkDetectorModel.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/LandmarkDetectorParameters.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/LandmarkDetectorUtils.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/Patch_experts.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/PAW.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/PDM.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/SVR_patch_expert.h"
    "/Users/kirtan/Desktop/OpenFace-master/lib/local/LandmarkDetector/include/stdafx.h"
    )
endif()

