'use server';
/**
 * @fileOverview A flow for organizing playlist metadata using AI to improve readability.
 *
 * - organizePlaylistMetadata - A function that organizes the playlist metadata.
 * - OrganizePlaylistMetadataInput - The input type for the organizePlaylistMetadata function.
 * - OrganizePlaylistMetadataOutput - The return type for the organizePlaylistMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OrganizePlaylistMetadataInputSchema = z.object({
  metadata: z.string().describe('The raw playlist metadata to organize.'),
});
export type OrganizePlaylistMetadataInput = z.infer<typeof OrganizePlaylistMetadataInputSchema>;

const OrganizePlaylistMetadataOutputSchema = z.object({
  organizedMetadata: z.string().describe('The organized playlist metadata.'),
});
export type OrganizePlaylistMetadataOutput = z.infer<typeof OrganizePlaylistMetadataOutputSchema>;

export async function organizePlaylistMetadata(input: OrganizePlaylistMetadataInput): Promise<OrganizePlaylistMetadataOutput> {
  return organizePlaylistMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'organizePlaylistMetadataPrompt',
  input: {schema: OrganizePlaylistMetadataInputSchema},
  output: {schema: OrganizePlaylistMetadataOutputSchema},
  prompt: `You are an expert in organizing playlist metadata for readability.

  Please organize the following playlist metadata in a clear and concise manner:

  {{metadata}}

  Ensure that the organized metadata is easy to understand and provides a comprehensive overview of the playlist.
  Return the organized metadata.
  `,
});

const organizePlaylistMetadataFlow = ai.defineFlow(
  {
    name: 'organizePlaylistMetadataFlow',
    inputSchema: OrganizePlaylistMetadataInputSchema,
    outputSchema: OrganizePlaylistMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
