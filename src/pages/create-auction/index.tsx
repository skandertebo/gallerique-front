import { useMutation } from "@apollo/client";
import { useReducer, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import AUCTION_QUERIES from "../../api/auction/auction.queries";
import FileService from "../../api/file/file.service";

type FormState = {
  startPrice: number;
  startDate: string;
  title: string;
  description: string;
  image: File | null;
};

type FormAction =
  | { type: "UPDATE_START_PRICE"; payload: number }
  | { type: "UPDATE_START_DATE"; payload: string }
  | { type: "UPDATE_TITLE"; payload: string }
  | { type: "UPDATE_DESCRIPTION"; payload: string }
  | { type: "UPDATE_IMAGE"; payload: File | null };

const initialState: FormState = {
  startPrice: 0,
  startDate: "",
  title: "",
  description: "",
  image: null,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "UPDATE_START_PRICE":
      return { ...state, startPrice: action.payload };
    case "UPDATE_START_DATE":
      return { ...state, startDate: action.payload };
    case "UPDATE_TITLE":
      return { ...state, title: action.payload };
    case "UPDATE_DESCRIPTION":
      return { ...state, description: action.payload };
    case "UPDATE_IMAGE":
      return { ...state, image: action.payload };
    default:
      return state;
  }
}

const formSchema = z.object({
  startPrice: z.number().min(1, "Start price must be greater than 0"),
  startDate: z.string().nonempty("Start date is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.instanceof(File).nullable(),
});

export default function CreateAuctionPage(): JSX.Element {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [createAuction, { loading: createAuctionLoading }] = useMutation(
    AUCTION_QUERIES.CREATE_AUCTION
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const navigate = useNavigate();
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "startPrice":
        dispatch({ type: "UPDATE_START_PRICE", payload: Number(value) });
        break;
      case "startDate":
        dispatch({ type: "UPDATE_START_DATE", payload: value });
        break;
      case "title":
        dispatch({ type: "UPDATE_TITLE", payload: value });
        break;
      case "description":
        dispatch({ type: "UPDATE_DESCRIPTION", payload: value });
        break;
      case "image":
        dispatch({
          type: "UPDATE_IMAGE",
          payload: (e.target as HTMLInputElement).files?.[0] ?? null,
        });
        break;
    }
  };

  const handleImageUploadClick = () => {
    document.getElementById("imageInput")?.click();
  };

  const imageUrl = formState.image ? URL.createObjectURL(formState.image) : "";

  const inputClassName = "border-2 border-palette-5 rounded-md p-2 w-fit";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      startPrice: formState.startPrice,
      startDate: formState.startDate,
      title: formState.title,
      description: formState.description,
      image: formState.image,
    };

    try {
      formSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
        return;
      }
    }
    let uploadImageResult: Awaited<ReturnType<typeof FileService.uploadImage>>;
    try {
      setIsUploadingImage(true);
      uploadImageResult = await FileService.uploadImage(formState.image!);
    } catch (error) {
      toast.error("Failed to upload image");
      return;
    } finally {
      setIsUploadingImage(false);
    }
    const token = uploadImageResult.token;
    try {
      const result = await createAuction({
        variables: {
          startPrice: formState.startPrice,
          startDate: formState.startDate,
          title: formState.title,
          description: formState.description,
          fileUploadToken: token,
        },
      });
      toast.success("Auction created successfully");
      navigate(`/auction/${result.data.createAuction.id}`);
    } catch (error) {
      toast.error("Failed to create auction");
    }
  };

  return (
    <div className="flex flex-col">
      <header className="w-[95%] mt-2 sm:mx-8 mx-2 border-b-2 border-palette-5 py-2 sm:py-4">
        <h1 className="text-4xl font-semibold text-palette-5">
          Create Auction
        </h1>
      </header>
      <div className="flex flex-col sm:mx-8 mx-2 my-4">
        <form className="flex flex-col gap-1" onSubmit={onSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Title"
            className={inputClassName}
          />
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            placeholder="Description"
            className={inputClassName}
          />
          <label htmlFor="startPrice">Start Price</label>
          <input
            type="number"
            name="startPrice"
            value={formState.startPrice}
            onChange={handleChange}
            placeholder="Start Price"
            className={inputClassName}
          />
          <label htmlFor="startDate">Start Date</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formState.startDate}
            onChange={handleChange}
            className={inputClassName}
          />
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="imageInput"
            name="image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            className={inputClassName}
          />
          {formState.image ? (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-32 h-32 object-cover cursor-pointer"
              onClick={handleImageUploadClick}
            />
          ) : (
            <div
              className="border-2 border-palette-5 rounded-md p-2 w-32 h-32 flex items-center justify-center cursor-pointer"
              onClick={handleImageUploadClick}
            >
              <span className="text-2xl font-bold">+</span>
            </div>
          )}
          <button
            type="submit"
            className="bg-palette-6 text-white py-0.5 px-2.5 rounded-md w-fit min-w-[130px] min-h-[30px]"
            disabled={createAuctionLoading}
          >
            {isUploadingImage || createAuctionLoading ? (
              <AiOutlineLoading className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              "Create Auction"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
