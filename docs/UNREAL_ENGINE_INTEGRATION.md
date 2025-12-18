# 🎮 Unreal Engine 5 Integration Guide for Mansion-Chain

## Overview

This guide provides detailed instructions for integrating Mansion-Chain digital property twins with Unreal Engine 5 for immersive 3D visualization and interactive experiences.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Blockchain Integration](#blockchain-integration)
4. [3D Model Integration](#3d-model-integration)
5. [Interactive Hotspots](#interactive-hotspots)
6. [Virtual Walkthrough System](#virtual-walkthrough-system)
7. [QR Code Integration](#qr-code-integration)
8. [Performance Optimization](#performance-optimization)

---

## Prerequisites

### Required Software
- Unreal Engine 5.3 or later
- Visual Studio 2022 (for C++ development)
- Node.js 18+ (for blockchain connectivity)
- Git

### Required Plugins
- **Web3Unreal** - Blockchain integration
- **JsonUtilities** - JSON parsing
- **HttpModule** - API communication
- **WebBrowser** - For wallet connections

### Install Plugins

```cpp
// In your .uproject file, add:
{
  "Plugins": [
    {
      "Name": "Web3Unreal",
      "Enabled": true
    },
    {
      "Name": "JsonUtilities",
      "Enabled": true
    },
    {
      "Name": "HttpModule",
      "Enabled": true
    }
  ]
}
```

---

## Project Setup

### 1. Create New Project

1. Open Unreal Engine 5
2. Create new project: **Blank Template**
3. Project settings:
   - Blueprint & C++ project
   - Desktop/Console
   - Maximum quality
   - No starter content

### 2. Configure Project Settings

**Edit → Project Settings → Engine → Network**:
- Enable: "Allow Download Image"
- Enable: "Verify Peer"

**Project Settings → Platform → Windows**:
- Default RHI: DirectX 12

### 3. Folder Structure

```
Content/
├── MansionChain/
│   ├── Blueprints/
│   │   ├── BP_PropertyViewer
│   │   ├── BP_Hotspot
│   │   └── BP_WalkthroughManager
│   ├── Models/
│   │   ├── Properties/
│   │   └── Hotspots/
│   ├── Materials/
│   ├── UI/
│   │   ├── WBP_PropertyInfo
│   │   ├── WBP_HotspotPopup
│   │   └── WBP_WalkthroughUI
│   └── Data/
│       ├── DT_Properties
│       └── DT_Hotspots
```

---

## Blockchain Integration

### 1. Web3 Manager C++ Class

Create `Web3Manager.h`:

```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "HttpModule.h"
#include "Interfaces/IHttpRequest.h"
#include "Interfaces/IHttpResponse.h"
#include "Web3Manager.generated.h"

USTRUCT(BlueprintType)
struct FPropertyData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite)
    FString PropertyName;

    UPROPERTY(BlueprintReadWrite)
    FString Location;

    UPROPERTY(BlueprintReadWrite)
    FString Architect;

    UPROPERTY(BlueprintReadWrite)
    int32 ConstructionYear;

    UPROPERTY(BlueprintReadWrite)
    FString UnrealEngineModelURI;

    UPROPERTY(BlueprintReadWrite)
    FString QRCodeHash;
};

USTRUCT(BlueprintType)
struct FHotspotData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite)
    FString Title;

    UPROPERTY(BlueprintReadWrite)
    FString Description;

    UPROPERTY(BlueprintReadWrite)
    FString ArchitecturalHighlight;

    UPROPERTY(BlueprintReadWrite)
    FVector Position;
};

UCLASS()
class MANSIONCHAIN_API AWeb3Manager : public AActor
{
    GENERATED_BODY()
    
public:
    AWeb3Manager();

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Web3")
    FString APIBaseURL = "http://localhost:3000/api";

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Web3")
    FString ContractAddress;

    UFUNCTION(BlueprintCallable, Category = "Web3")
    void LoadPropertyData(int32 TokenId);

    UFUNCTION(BlueprintCallable, Category = "Web3")
    void LoadPropertyByQR(FString QRHash);

    UFUNCTION(BlueprintCallable, Category = "Web3")
    void LoadHotspots(int32 TokenId);

protected:
    virtual void BeginPlay() override;

private:
    void OnPropertyDataReceived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
    void OnHotspotsReceived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);

    UPROPERTY()
    FPropertyData CurrentProperty;

    UPROPERTY()
    TArray<FHotspotData> CurrentHotspots;

    DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnPropertyLoaded, FPropertyData, PropertyData);
    UPROPERTY(BlueprintAssignable, Category = "Web3")
    FOnPropertyLoaded OnPropertyLoaded;

    DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHotspotsLoaded, const TArray<FHotspotData>&, Hotspots);
    UPROPERTY(BlueprintAssignable, Category = "Web3")
    FOnHotspotsLoaded OnHotspotsLoaded;
};
```

Create `Web3Manager.cpp`:

```cpp
#include "Web3Manager.h"
#include "Json.h"
#include "JsonUtilities.h"

AWeb3Manager::AWeb3Manager()
{
    PrimaryActorTick.bCanEverTick = false;
}

void AWeb3Manager::BeginPlay()
{
    Super::BeginPlay();
}

void AWeb3Manager::LoadPropertyData(int32 TokenId)
{
    FString URL = FString::Printf(TEXT("%s/property/%d"), *APIBaseURL, TokenId);
    
    TSharedRef<IHttpRequest> Request = FHttpModule::Get().CreateRequest();
    Request->OnProcessRequestComplete().BindUObject(this, &AWeb3Manager::OnPropertyDataReceived);
    Request->SetURL(URL);
    Request->SetVerb("GET");
    Request->SetHeader("Content-Type", "application/json");
    Request->ProcessRequest();
}

void AWeb3Manager::LoadPropertyByQR(FString QRHash)
{
    FString URL = FString::Printf(TEXT("%s/property/qr/%s"), *APIBaseURL, *QRHash);
    
    TSharedRef<IHttpRequest> Request = FHttpModule::Get().CreateRequest();
    Request->OnProcessRequestComplete().BindUObject(this, &AWeb3Manager::OnPropertyDataReceived);
    Request->SetURL(URL);
    Request->SetVerb("GET");
    Request->SetHeader("Content-Type", "application/json");
    Request->ProcessRequest();
}

void AWeb3Manager::OnPropertyDataReceived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
    if (bWasSuccessful && Response.IsValid())
    {
        TSharedPtr<FJsonObject> JsonObject;
        TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Response->GetContentAsString());
        
        if (FJsonSerializer::Deserialize(Reader, JsonObject))
        {
            TSharedPtr<FJsonObject> PropertyObject = JsonObject->GetObjectField("property");
            
            CurrentProperty.PropertyName = PropertyObject->GetStringField("name");
            CurrentProperty.Location = PropertyObject->GetStringField("location");
            CurrentProperty.Architect = PropertyObject->GetStringField("architect");
            CurrentProperty.ConstructionYear = PropertyObject->GetNumberField("constructionYear");
            CurrentProperty.UnrealEngineModelURI = PropertyObject->GetStringField("unrealEngineModel");
            CurrentProperty.QRCodeHash = PropertyObject->GetStringField("qrCode");
            
            OnPropertyLoaded.Broadcast(CurrentProperty);
        }
    }
}

void AWeb3Manager::LoadHotspots(int32 TokenId)
{
    FString URL = FString::Printf(TEXT("%s/property/%d/hotspots"), *APIBaseURL, TokenId);
    
    TSharedRef<IHttpRequest> Request = FHttpModule::Get().CreateRequest();
    Request->OnProcessRequestComplete().BindUObject(this, &AWeb3Manager::OnHotspotsReceived);
    Request->SetURL(URL);
    Request->SetVerb("GET");
    Request->SetHeader("Content-Type", "application/json");
    Request->ProcessRequest();
}

void AWeb3Manager::OnHotspotsReceived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
    if (bWasSuccessful && Response.IsValid())
    {
        TSharedPtr<FJsonObject> JsonObject;
        TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Response->GetContentAsString());
        
        if (FJsonSerializer::Deserialize(Reader, JsonObject))
        {
            const TArray<TSharedPtr<FJsonValue>>* HotspotsArray;
            if (JsonObject->TryGetArrayField("hotspots", HotspotsArray))
            {
                CurrentHotspots.Empty();
                
                for (const TSharedPtr<FJsonValue>& HotspotValue : *HotspotsArray)
                {
                    TSharedPtr<FJsonObject> HotspotObj = HotspotValue->AsObject();
                    
                    FHotspotData Hotspot;
                    Hotspot.Title = HotspotObj->GetStringField("title");
                    Hotspot.Description = HotspotObj->GetStringField("description");
                    Hotspot.ArchitecturalHighlight = HotspotObj->GetStringField("architecturalHighlight");
                    
                    TSharedPtr<FJsonObject> PosObj = HotspotObj->GetObjectField("position");
                    Hotspot.Position = FVector(
                        PosObj->GetNumberField("x"),
                        PosObj->GetNumberField("y"),
                        PosObj->GetNumberField("z")
                    );
                    
                    CurrentHotspots.Add(Hotspot);
                }
                
                OnHotspotsLoaded.Broadcast(CurrentHotspots);
            }
        }
    }
}
```

---

## 3D Model Integration

### 1. IPFS Model Loader

Create `IPFSModelLoader.h`:

```cpp
#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "IPFSModelLoader.generated.h"

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class MANSIONCHAIN_API UIPFSModelLoader : public UActorComponent
{
    GENERATED_BODY()

public:
    UIPFSModelLoader();

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "IPFS")
    FString IPFSGateway = "https://ipfs.io/ipfs/";

    UFUNCTION(BlueprintCallable, Category = "IPFS")
    void LoadModelFromIPFS(FString IPFSHash);

protected:
    virtual void BeginPlay() override;

private:
    void OnModelDownloaded(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
    void ProcessGLTFModel(const TArray<uint8>& ModelData);

    DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnModelLoaded, UStaticMesh*, LoadedMesh);
    UPROPERTY(BlueprintAssignable, Category = "IPFS")
    FOnModelLoaded OnModelLoaded;
};
```

### 2. Blueprint: Property Viewer

Create Blueprint `BP_PropertyViewer`:

**Event Graph**:

```
Event BeginPlay
  └─> Load Property Data (Web3Manager)
      └─> On Property Loaded
          └─> Load Model from IPFS
          └─> Spawn Hotspots
          └─> Initialize UI
```

---

## Interactive Hotspots

### 1. Hotspot Actor

Create `HotspotActor.h`:

```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/WidgetComponent.h"
#include "HotspotActor.generated.h"

UCLASS()
class MANSIONCHAIN_API AHotspotActor : public AActor
{
    GENERATED_BODY()
    
public:
    AHotspotActor();

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Hotspot")
    FString Title;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Hotspot")
    FString Description;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Hotspot")
    FString ArchitecturalHighlight;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Hotspot")
    FString BuilderCredits;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Hotspot")
    FString MaterialHistory;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    UStaticMeshComponent* HotspotMesh;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    UWidgetComponent* InfoWidget;

    UFUNCTION(BlueprintCallable, Category = "Hotspot")
    void ShowInfo();

    UFUNCTION(BlueprintCallable, Category = "Hotspot")
    void HideInfo();

protected:
    virtual void BeginPlay() override;
    virtual void NotifyActorBeginCursorOver() override;
    virtual void NotifyActorEndCursorOver() override;
};
```

### 2. Hotspot Widget

Create Widget Blueprint `WBP_HotspotPopup`:

**Design**:
- Border (semi-transparent background)
  - Vertical Box
    - Text Block: Title
    - Text Block: Description
    - Text Block: Architectural Highlight
    - Text Block: Builder Credits
    - Text Block: Materials

---

## Virtual Walkthrough System

### 1. Walkthrough Manager

Create Blueprint `BP_WalkthroughManager`:

**Variables**:
- `CurrentTokenId` (Integer)
- `IsWalkthroughActive` (Boolean)
- `WalkthroughSpeed` (Float, default: 100.0)
- `WalkthroughPath` (Array of Vectors)
- `CurrentPathIndex` (Integer)

**Functions**:

```cpp
// StartWalkthrough
void StartWalkthrough(int32 TokenId, int32 EventId)
{
    // Load walkthrough data from blockchain
    // Initialize camera movement
    // Start timeline
}

// UpdateWalkthrough (Tick)
void UpdateWalkthrough(float DeltaTime)
{
    if (IsWalkthroughActive)
    {
        // Move camera along path
        // Update UI with information
        // Trigger hotspot highlights
    }
}

// RegisterAttendee
void RegisterAttendee(FString WalletAddress)
{
    // Call blockchain contract
    // Update attendance list
}
```

---

## QR Code Integration

### 1. QR Code Scanner Widget

Create Widget Blueprint `WBP_QRScanner`:

**Design**:
- Web Browser component for camera access
- JavaScript integration for QR code reading
- Callback to Blueprint when QR detected

**Blueprint Graph**:

```
On QR Code Scanned
  └─> Extract QR Hash
      └─> Web3Manager → Load Property By QR
          └─> Transition to Property View
```

### 2. Physical Plaque Interaction

```cpp
// In your player controller
void OnQRCodeScanned(FString QRHash)
{
    // Validate QR code format
    if (QRHash.StartsWith("0x") && QRHash.Len() == 64)
    {
        // Load property from blockchain
        Web3Manager->LoadPropertyByQR(QRHash);
        
        // Show loading screen
        ShowLoadingWidget();
    }
}
```

---

## Performance Optimization

### 1. Level of Detail (LOD)

Configure LOD settings for property models:

```cpp
// In StaticMesh settings
LOD0: Full detail (< 10m distance)
LOD1: Medium detail (10-50m)
LOD2: Low detail (50-100m)
LOD3: Minimum detail (> 100m)
```

### 2. Texture Streaming

```cpp
// Project Settings → Engine → Rendering
Texture Streaming: Enabled
Pool Size: 3000 MB
Use New Texture Streaming: Enabled
```

### 3. Occlusion Culling

```cpp
// Enable in viewport
Show → Visualize → Precomputed Visibility
```

### 4. Nanite for High-Poly Models

```cpp
// Enable Nanite for UE5 static meshes
StaticMesh → Details → Nanite Settings
  └─> Enable Nanite Support: True
```

---

## Example Blueprint: Complete Property Viewer

```
┌─────────────────────────────────────────┐
│ BP_PropertyViewer                       │
├─────────────────────────────────────────┤
│ Components:                             │
│  • Scene Root                           │
│  • Camera                               │
│  • Property Mesh (Dynamic)              │
│  • Hotspot Manager                      │
│  • UI Widget                            │
├─────────────────────────────────────────┤
│ Variables:                              │
│  • TokenId (Integer)                    │
│  • PropertyData (FPropertyData)         │
│  • Hotspots (Array<FHotspotData>)       │
│  • Web3Manager (Reference)              │
├─────────────────────────────────────────┤
│ Functions:                              │
│  • Initialize(TokenId)                  │
│  • LoadProperty()                       │
│  • SpawnHotspots()                      │
│  • StartVirtualTour()                   │
└─────────────────────────────────────────┘
```

---

## Testing Checklist

- [ ] Property loads correctly from blockchain
- [ ] 3D model displays with correct scale
- [ ] Hotspots appear at correct positions
- [ ] Hotspot hover shows information
- [ ] QR code scanning works
- [ ] Virtual walkthrough plays smoothly
- [ ] Performance maintains 60+ FPS
- [ ] Memory usage stays under limits

---

## Deployment

### Packaging for Windows

```bash
# Package settings
File → Package Project → Windows
  └─> Shipping configuration
  └─> Include prerequisite installer
```

### Distribution

1. Package the project
2. Include README with:
   - System requirements
   - Web3 wallet setup
   - Network connection requirements
3. Test on clean machine

---

## Support

For Unreal Engine integration support:
- Documentation: `/docs/MANSION_CHAIN_ECOSYSTEM.md`
- Discord: #unreal-engine channel
- Email: ue5@mansionchain.xyz

---

**Built with Unreal Engine 5 + Mansion-Chain 🏰**
