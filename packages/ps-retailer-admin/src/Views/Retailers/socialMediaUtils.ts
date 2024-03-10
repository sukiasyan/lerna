import {
  IUnitySocialMediaTypes,
  IUnitySocialMediaURL
} from '~/types/Retailers';

export const updateSocialMediaUrl = (
  socialMediaURLs: IUnitySocialMediaURL[],
  setSocialMediaURLs: (urls: IUnitySocialMediaURL[]) => void,
  platform: IUnitySocialMediaTypes,
  url: string
) => {
  const updatedSocialMediaURLs = socialMediaURLs ?? [];
  const foundSocialMedia = updatedSocialMediaURLs.findIndex(
    (socialMedia) => socialMedia.platform === platform
  );

  if (foundSocialMedia !== -1) {
    updatedSocialMediaURLs[foundSocialMedia].url = url;
  } else {
    updatedSocialMediaURLs.push({ platform, url });
  }

  setSocialMediaURLs(
    updatedSocialMediaURLs.filter((item) => Boolean(item.url))
  );
};

export const updateSocialMediaUrlEditForm = (
  socialMediaURLs: IUnitySocialMediaURL[] | null,
  setSocialMediaURLs: (urls: IUnitySocialMediaURL[]) => void,
  platform: IUnitySocialMediaTypes,
  url: string
) => {
  console.log(
    'Function: updateSocialMediaUrlEditForm - Line 34 - ',
    socialMediaURLs
  );
  try {
    const updatedSocialMediaURLs = (socialMediaURLs ?? []).map((socialMedia) =>
      socialMedia.platform === platform
        ? { ...socialMedia, url } // Update the url property for the matching platform
        : socialMedia
    );

    // If the platform was not found, add a new entry
    if (
      !updatedSocialMediaURLs.some(
        (socialMedia) => socialMedia.platform === platform
      )
    ) {
      updatedSocialMediaURLs.push({ platform, url });
    }

    // Remove entries with empty urls
    const filteredSocialMediaURLs = updatedSocialMediaURLs.filter((item) =>
      Boolean(item.url)
    );
    console.log(
      'Function: updateSocialMediaUrlEditForm - Line 54 - ',
      filteredSocialMediaURLs
    );
    setSocialMediaURLs(filteredSocialMediaURLs);
  } catch (error) {
    console.error('Error in updateSocialMediaUrl:', error);
  }
};
